'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'

interface AdminPetItem {
  id: string
  name: string
  username: string
  species?: string
  breed?: string
  city?: string
  profile_image_url: string
  is_verified: boolean
  is_founding_pet: boolean
  created_at: string
  owner?: {
    id: string
    email: string
    is_admin?: boolean
  }
}

interface AdminUserItem {
  id: string
  email: string
  is_admin: boolean
  role?: string
  status: 'active' | 'suspended' | 'deleted'
  created_at: string
  pets?: Array<{
    id: string
    name: string
    username: string
    profile_image_url: string
    breed?: string
  }>
}

export default function AdminDirectoryPage() {
  const [directoryType, setDirectoryType] = useState<'pets' | 'users'>('pets')

  // Pet Directory state
  const [pets, setPets] = useState<AdminPetItem[]>([])
  const [petLoading, setPetLoading] = useState(true)
  const [petSearch, setPetSearch] = useState('')
  const [petFilter, setPetFilter] = useState<'all' | 'verified' | 'founding'>('all')

  // User Directory state
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [userLoading, setUserLoading] = useState(true)
  const [userSearch, setUserSearch] = useState('')
  const [userFilter, setUserFilter] = useState<'all' | 'active' | 'suspended' | 'admin'>('all')

  // Fetch Pets (Filters out breed == 'Pet Lover' on backend)
  const fetchPets = async () => {
    setPetLoading(true)
    try {
      const res = await apiFetch<{ pets: AdminPetItem[] }>(
        `/admin/pets?search=${encodeURIComponent(petSearch)}&filter=${petFilter}`
      )
      if (res && res.pets) {
        setPets(res.pets)
      }
    } catch (err) {
      console.error('[AdminPets] Fetch error:', err)
      toast.error('Failed to fetch pet directory')
    } finally {
      setPetLoading(false)
    }
  }

  // Fetch Users
  const fetchUsers = async () => {
    setUserLoading(true)
    try {
      const res = await apiFetch<{ users: AdminUserItem[] }>(
        `/admin/users?search=${encodeURIComponent(userSearch)}&filter=${userFilter}`
      )
      if (res && res.users) {
        setUsers(res.users)
      }
    } catch (err) {
      console.error('[AdminUsers] Fetch error:', err)
      toast.error('Failed to fetch pet lovers directory')
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    if (directoryType === 'pets') {
      const timer = setTimeout(() => fetchPets(), 200)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => fetchUsers(), 200)
      return () => clearTimeout(timer)
    }
  }, [directoryType, petSearch, petFilter, userSearch, userFilter])

  // Pet Badge Toggle handler
  const handleToggleBadge = async (
    petId: string,
    currentVerified: boolean,
    currentFounding: boolean,
    field: 'isVerified' | 'isFoundingPet'
  ) => {
    const nextVerified = field === 'isVerified' ? !currentVerified : currentVerified
    const nextFounding = field === 'isFoundingPet' ? !currentFounding : currentFounding

    // Optimistic UI update
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              is_verified: nextVerified,
              is_founding_pet: nextFounding,
            }
          : p
      )
    )

    try {
      const res = await apiFetch<{ success: boolean; pet: AdminPetItem }>(
        `/admin/pets/${petId}/badges`,
        {
          method: 'POST',
          json: {
            isVerified: nextVerified,
            isFoundingPet: nextFounding,
          },
        }
      )

      if (res && res.success) {
        if (field === 'isVerified') {
          toast.success(
            nextVerified ? 'Verified checkmark issued ✓' : 'Verified checkmark removed'
          )
        } else {
          toast.success(
            nextFounding ? 'Founding Pet crown issued 👑' : 'Founding Pet crown removed'
          )
        }
      }
    } catch (err: any) {
      setPets((prev) =>
        prev.map((p) =>
          p.id === petId
            ? {
                ...p,
                is_verified: currentVerified,
                is_founding_pet: currentFounding,
              }
            : p
        )
      )
      toast.error(err?.message || 'Failed to update pet badges')
    }
  }

  // User Account Status / Admin Toggle handler
  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: string,
    nextStatus?: 'active' | 'suspended',
    nextAdmin?: boolean
  ) => {
    // Optimistic update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              ...(nextStatus ? { status: nextStatus } : {}),
              ...(typeof nextAdmin === 'boolean' ? { is_admin: nextAdmin } : {}),
            }
          : u
      )
    )

    try {
      const res = await apiFetch<{ success: boolean; user: AdminUserItem }>(
        `/admin/users/${userId}/status`,
        {
          method: 'POST',
          json: {
            status: nextStatus,
            isAdmin: nextAdmin,
          },
        }
      )

      if (res && res.success) {
        if (nextStatus) {
          toast.success(
            nextStatus === 'suspended'
              ? 'User account suspended 🚫'
              : 'User account reactivated ✓'
          )
        }
        if (typeof nextAdmin === 'boolean') {
          toast.success(
            nextAdmin ? 'Super admin privileges granted 👑' : 'Admin privileges revoked'
          )
        }
      }
    } catch (err: any) {
      fetchUsers()
      toast.error(err?.message || 'Failed to update user account')
    }
  }

  return (
    <div className="space-y-6">
      {/* Directory Segregation Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE8E1]">
        <div>
          <h1
            className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <span>{directoryType === 'pets' ? 'Pets Directory 🐾' : 'Pet Lovers Directory 👤'}</span>
          </h1>
          <p className="text-xs text-[#727974] mt-1">
            {directoryType === 'pets'
              ? 'Manage registered animal pet profiles (Dogs, Cats, Hamsters, etc.), issue Verified checkmarks, and grant Founding Pet honors.'
              : 'Oversee registered pet lover accounts, verify admin roles, and enforce account suspensions.'}
          </p>
        </div>

        {/* Directory Switcher Segments */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-full border border-[#EDE8E1]">
          <button
            onClick={() => setDirectoryType('pets')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              directoryType === 'pets'
                ? 'bg-[#163328] text-white shadow-xs'
                : 'text-[#727974] hover:text-[#011E14] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">pets</span>
            <span>Pets Directory</span>
          </button>

          <button
            onClick={() => setDirectoryType('users')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
              directoryType === 'users'
                ? 'bg-[#163328] text-white shadow-xs'
                : 'text-[#727974] hover:text-[#011E14] hover:bg-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Pet Lovers Directory</span>
          </button>
        </div>
      </div>

      {/* Directory Filter & Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="bg-white p-3 px-4 rounded-3xl border border-[#EDE8E1] shadow-2xs flex items-center gap-3 flex-1">
          <span className="material-symbols-outlined text-[20px] text-[#727974]">search</span>
          <input
            type="text"
            value={directoryType === 'pets' ? petSearch : userSearch}
            onChange={(e) =>
              directoryType === 'pets'
                ? setPetSearch(e.target.value)
                : setUserSearch(e.target.value)
            }
            placeholder={
              directoryType === 'pets'
                ? 'Search by pet name, @handle, breed, or city...'
                : 'Search by owner account email...'
            }
            className="flex-1 bg-transparent text-xs text-[#011E14] placeholder-[#727974] focus:outline-none"
          />
          {(directoryType === 'pets' ? petSearch : userSearch) && (
            <button
              onClick={() =>
                directoryType === 'pets' ? setPetSearch('') : setUserSearch('')
              }
              className="text-[#727974] hover:text-[#011E14] text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-full border border-[#EDE8E1] shadow-2xs shrink-0 overflow-x-auto">
          {directoryType === 'pets'
            ? [
                { id: 'all', label: 'All Pets' },
                { id: 'verified', label: 'Verified ✓' },
                { id: 'founding', label: 'Founding Pets 👑' },
              ].map((tab) => {
                const isActive = petFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPetFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#163328] text-white shadow-2xs'
                        : 'text-[#727974] hover:text-[#011E14] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })
            : [
                { id: 'all', label: 'All Accounts' },
                { id: 'active', label: 'Active' },
                { id: 'suspended', label: 'Suspended 🚫' },
                { id: 'admin', label: 'Admins 👑' },
              ].map((tab) => {
                const isActive = userFilter === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setUserFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#163328] text-white shadow-2xs'
                        : 'text-[#727974] hover:text-[#011E14] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
        </div>
      </div>

      {/* VIEW 1: PETS DIRECTORY TABLE (Animal Pets Only) */}
      {directoryType === 'pets' && (
        <div className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#EDE8E1] text-[#727974] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Pet Profile</th>
                  <th className="py-3.5 px-6">Owner Account</th>
                  <th className="py-3.5 px-6">Badges & Verification</th>
                  <th className="py-3.5 px-6 text-center">Verified Check</th>
                  <th className="py-3.5 px-6 text-center">Founding Pet</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E1]">
                {petLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#727974]">
                      Searching pet directory...
                    </td>
                  </tr>
                ) : pets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#727974]">
                      No animal pet profiles match your search criteria.
                    </td>
                  </tr>
                ) : (
                  pets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="hover:bg-[#FAF7F2] transition-colors duration-100"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {pet.profile_image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={pet.profile_image_url}
                              alt={pet.name}
                              className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] flex items-center justify-center text-[#E8843A]">
                              <span className="material-symbols-outlined text-[18px]">pets</span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#011E14] text-[13px]">{pet.name}</span>
                              <span className="text-[11px] text-[#727974]">@{pet.username || 'pet'}</span>
                            </div>
                            <p className="text-[11px] text-[#727974]">
                              {pet.breed || pet.species || 'Dog'} • {pet.city || 'Bangalore'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <p className="font-bold text-[#011E14] leading-tight">
                          {pet.owner?.email || 'N/A'}
                        </p>
                        {pet.owner?.is_admin && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-[#163328] text-[#34D399] text-[9px] font-bold uppercase tracking-wider">
                            Admin Owner
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {pet.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[11px]">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span>
                              <span>Verified</span>
                            </span>
                          )}

                          {pet.is_founding_pet && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] font-bold text-[11px]">
                              <span>👑 Founding Pet</span>
                            </span>
                          )}

                          {!pet.is_verified && !pet.is_founding_pet && (
                            <span className="text-[11px] text-[#727974] italic">Standard</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleBadge(pet.id, pet.is_verified, pet.is_founding_pet, 'isVerified')
                          }
                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                            pet.is_verified ? 'bg-[#15803D]' : 'bg-[#EDE8E1]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 transform ${
                              pet.is_verified ? 'translate-x-6' : 'translate-x-0'
                            }`}
                            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                          />
                        </button>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleBadge(pet.id, pet.is_verified, pet.is_founding_pet, 'isFoundingPet')
                          }
                          className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                            pet.is_founding_pet ? 'bg-[#D97706]' : 'bg-[#EDE8E1]'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 transform ${
                              pet.is_founding_pet ? 'translate-x-6' : 'translate-x-0'
                            }`}
                            style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                          />
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <a
                          href={`/pet/${pet.username || pet.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-full bg-[#FAF7F2] hover:bg-[#F5F2ED] text-[#011E14] font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PET LOVERS (HUMAN ACCOUNTS) DIRECTORY TABLE */}
      {directoryType === 'users' && (
        <div className="bg-white rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] border-b border-[#EDE8E1] text-[#727974] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">User Account</th>
                  <th className="py-3.5 px-6">Registered Pets</th>
                  <th className="py-3.5 px-6">Privilege Role</th>
                  <th className="py-3.5 px-6">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE8E1]">
                {userLoading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[#727974]">
                      Searching pet lovers directory...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[#727974]">
                      No pet lover accounts match your search criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => {
                    const isUserAdmin = Boolean(
                      userItem.is_admin ||
                        userItem.role === 'super_admin' ||
                        userItem.role === 'admin'
                    )

                    // Separate actual pets from human lover profiles
                    const loverProfile = userItem.pets?.find((p) => p.breed === 'Pet Lover')
                    const actualPets = userItem.pets?.filter((p) => p.breed !== 'Pet Lover') || []

                    return (
                      <tr
                        key={userItem.id}
                        className="hover:bg-[#FAF7F2] transition-colors duration-100"
                      >
                        {/* Account Email & ID & Lover Handle */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {loverProfile?.profile_image_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={loverProfile.profile_image_url}
                                alt={userItem.email}
                                className="w-9 h-9 rounded-full object-cover border border-[#EDE8E1]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#163328]/10 text-[#163328] flex items-center justify-center font-bold text-sm shrink-0">
                                {userItem.email.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-[#011E14] text-[13px]">{userItem.email}</p>
                                {loverProfile?.username && (
                                  <span className="text-[11px] text-[#727974]">
                                    @{loverProfile.username}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#727974] font-mono">
                                ID: {userItem.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Registered Pets list */}
                        <td className="py-4 px-6">
                          {actualPets.length > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] font-bold text-[11px] text-[#15803D]">
                                {actualPets.length} {actualPets.length === 1 ? 'pet' : 'pets'}
                              </span>
                              {actualPets.slice(0, 3).map((p) => (
                                <span key={p.id} className="text-[11px] text-[#011E14] font-medium">
                                  🐾 {p.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#727974] italic">Pet Lover (No pets registered)</span>
                          )}
                        </td>

                        {/* Privilege Role */}
                        <td className="py-4 px-6">
                          {isUserAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#163328] text-[#34D399] font-bold text-[11px]">
                              <span>👑 Super Admin</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EDE8E1] text-[#727974] font-medium text-[11px]">
                              <span>Member</span>
                            </span>
                          )}
                        </td>

                        {/* Account Status */}
                        <td className="py-4 px-6">
                          {userItem.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-[11px]">
                              <span>🚫 Suspended</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-[11px]">
                              <span>✓ Active</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Admin */}
                            <button
                              onClick={() =>
                                handleToggleUserStatus(
                                  userItem.id,
                                  userItem.status,
                                  undefined,
                                  !isUserAdmin
                                )
                              }
                              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all active:scale-95 border ${
                                isUserAdmin
                                  ? 'bg-white border-[#EDE8E1] text-[#727974] hover:bg-[#FAF7F2]'
                                  : 'bg-[#163328] text-white hover:bg-[#011E14]'
                              }`}
                            >
                              {isUserAdmin ? 'Revoke Admin' : 'Make Admin 👑'}
                            </button>

                            {/* Suspend / Activate */}
                            {userItem.status === 'suspended' ? (
                              <button
                                onClick={() =>
                                  handleToggleUserStatus(
                                    userItem.id,
                                    userItem.status,
                                    'active'
                                  )
                                }
                                className="px-3 py-1.5 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] font-bold text-[11px] transition-all active:scale-95"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleUserStatus(
                                    userItem.id,
                                    userItem.status,
                                    'suspended'
                                  )
                                }
                                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-[11px] transition-colors active:scale-95"
                              >
                                Suspend 🚫
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
