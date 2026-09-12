'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { PET_TYPE_OPTIONS, BREEDS_BY_PET_TYPE } from '@/constants/petData'
import { Dog, Cat, Bird, Rabbit, Shapes } from 'lucide-react'

function PetTypeIcon({ type }: { type: string }) {
  const iconProps = { className: "w-4 h-4 flex-shrink-0" }
  switch (type) {
    case 'dogs':
      return <Dog {...iconProps} />
    case 'cats':
      return <Cat {...iconProps} />
    case 'birds':
      return <Bird {...iconProps} />
    case 'rabbits':
      return <Rabbit {...iconProps} />
    default:
      return <Shapes {...iconProps} />
  }
}

export default function JoinProfilePage() {
  const router = useRouter()
  const { onboardingData, setOnboardingData } = useAuthStore()
  const role = onboardingData?.role || 'parent'

  // Pet parent fields
  const [petName, setPetName] = useState(onboardingData?.petName || '')
  const [petUsername, setPetUsername] = useState(onboardingData?.petUsername || '')
  const [petType, setPetType] = useState<string>(onboardingData?.petType || '')
  const [customPetType, setCustomPetType] = useState(onboardingData?.customPetType || '')
  const [breed, setBreed] = useState(onboardingData?.breed || '')
  const [customBreed, setCustomBreed] = useState(onboardingData?.customBreed || '')
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>(onboardingData?.gender || 'unknown')
  const [city, setCity] = useState(onboardingData?.city || '')

  // Searchable Breed Dropdown State
  const [isBreedDropdownOpen, setIsBreedDropdownOpen] = useState(false)
  const [breedSearchQuery, setBreedSearchQuery] = useState('')
  const breedDropdownRef = useRef<HTMLDivElement>(null)

  // Username checking states
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // Pet lover fields
  const [displayName, setDisplayName] = useState(onboardingData?.petName || '')
  const [loverUsername, setLoverUsername] = useState(onboardingData?.petUsername || '')

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(onboardingData?.avatarData || null)
  const [avatarBase64, setAvatarBase64] = useState<string | null>(onboardingData?.avatarData || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle progress animation
  const [progressWidth, setProgressWidth] = useState('0%')
  useEffect(() => {
    const t = setTimeout(() => setProgressWidth('50%'), 200)
    return () => clearTimeout(t)
  }, [])

  // Close breed dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (breedDropdownRef.current && !breedDropdownRef.current.contains(event.target as Node)) {
        setIsBreedDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced username availability check
  useEffect(() => {
    const targetUsername = role === 'parent' ? petUsername : loverUsername
    if (!targetUsername || targetUsername.length < 3) {
      setUsernameAvailable(null)
      setUsernameError(null)
      return
    }

    setIsCheckingUsername(true)
    setUsernameError(null)

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(`/auth/check-username?username=${targetUsername}`)
        setUsernameAvailable(res.available)
        if (!res.available) {
          setUsernameError('This username is already taken.')
        }
      } catch (err: any) {
        setUsernameError(err.message || 'Error checking username.')
      } finally {
        setIsCheckingUsername(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [petUsername, loverUsername, role])

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxDim = 400
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width)
              width = maxDim
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height)
              height = maxDim
            }
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          const compressed = canvas.toDataURL('image/jpeg', 0.8)
          resolve(compressed)
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Compress client-side
      const compressed = await compressImage(file)
      setAvatarPreview(compressed)
      setAvatarBase64(compressed)
    } catch (err) {
      console.error('Failed to compress avatar:', err)
      // Fallback to standard base64 if canvas compression fails
      const reader = new FileReader()
      reader.onload = () => {
        setAvatarPreview(reader.result as string)
        setAvatarBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()

    const resolvedPetType = petType === 'other' ? (customPetType || 'Other') : petType
    const resolvedBreed = breed === 'Other' ? (customBreed || 'Other') : (breed || 'Unknown')

    if (role === 'parent') {
      setOnboardingData({
        petName,
        petUsername: petUsername ? petUsername.trim() : undefined,
        petType: resolvedPetType,
        customPetType: petType === 'other' ? customPetType : undefined,
        breed: resolvedBreed,
        customBreed: breed === 'Other' ? customBreed : undefined,
        gender,
        city,
        avatarData: avatarBase64 || undefined,
      })
    } else {
      setOnboardingData({
        petName: displayName,
        petUsername: loverUsername ? loverUsername.trim() : undefined,
        city,
        avatarData: avatarBase64 || undefined,
      })
    }

    router.push('/join/bio')
  }

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'unknown', label: 'Other' },
  ]

  // Filter breed options based on pet type and user search query
  const availableBreeds = petType
    ? (BREEDS_BY_PET_TYPE[petType] || [])
    : []
  const filteredBreeds = availableBreeds.filter((b) =>
    b.toLowerCase().includes(breedSearchQuery.toLowerCase())
  )

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fdf8f2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 right-0 w-96 h-96 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(130px)', opacity: 0.15 }}
        />
        <div
          className="absolute bottom-0 -left-20 w-80 h-80 rounded-full"
          style={{ background: '#adcebe', filter: 'blur(130px)', opacity: 0.15 }}
        />
      </div>

      {/* Top Nav */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 h-14"
        style={{ background: 'rgba(253,248,242,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(219,193,179,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/join/select"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:opacity-70 active:scale-95"
            style={{ color: '#974900' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'wght' 500" }}>
              arrow_back
            </span>
          </Link>
          <span className="font-bold text-[18px]" style={{ fontFamily: 'Outfit, sans-serif', color: '#974900' }}>
            Furlo
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#887366' }}>
          Step 2 of 4
        </span>
        <button className="text-[13px] font-medium hover:underline" style={{ color: '#974900' }}>
          Save Progress
        </button>
      </header>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-[3px]" style={{ background: '#ece7e2' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: progressWidth, background: 'linear-gradient(90deg, #974900, #E8843A)' }}
        />
      </div>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center pt-24 pb-12 px-4">
        <div
          className="w-full max-w-[480px] rounded-[24px] p-6 md:p-10"
          style={{
            background: '#fffbf7',
            border: '1px solid #ede8e1',
            boxShadow: '0 8px 32px rgba(28,35,41,0.04)',
            animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Step info */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span
                className="uppercase tracking-wider font-bold text-[11px]"
                style={{ color: 'rgba(85,67,56,0.7)' }}
              >
                Step 2 of 4
              </span>
              <div
                className="w-28 h-1.5 rounded-full overflow-hidden"
                style={{ background: '#f2ede7' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: '50%', background: '#E8843A', transition: 'width 1s ease-out' }}
                />
              </div>
            </div>
            <h1
              className="font-bold leading-tight mb-2"
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', color: '#2D4A3E' }}
            >
              {role === 'parent' ? "Set up your pet's Paw Print" : 'Build your Paw Print'}
            </h1>
            <p className="text-[15px]" style={{ color: '#554338' }}>
              {role === 'parent' ? 'This is how the pack will know them.' : 'Tell the pack a bit about yourself.'}
            </p>
          </div>

          <form onSubmit={handleContinue} className="flex flex-col gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center mb-2">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed" style={{ borderColor: '#E8843A' }}>
                    <img src={avatarPreview} alt="Pet avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all"
                    style={{
                      borderColor: '#dbc1b3',
                      background: '#f8f3ed',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#E8843A'
                      e.currentTarget.style.background = 'rgba(255,219,199,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#dbc1b3'
                      e.currentTarget.style.background = '#f8f3ed'
                    }}
                  >
                    <span
                      className="material-symbols-outlined mb-1"
                      style={{ color: '#dbc1b3', fontSize: '28px' }}
                    >
                      photo_camera
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: '#dbc1b3' }}
                    >
                      Add photo
                    </span>
                  </div>
                )}
                {/* Plus badge */}
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                  style={{ background: '#E8843A' }}
                >
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>
                    add
                  </span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <p className="text-[12px] mt-2" style={{ color: '#887366' }}>
                Upload a photo (optional)
              </p>
            </div>

            {role === 'parent' ? (
              <>
                {/* Pet Name */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: '#476558' }}
                  >
                    Pet's Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What do you call them?"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                    style={{
                      background: '#fff',
                      borderColor: '#ede8e1',
                      color: '#1d1b18',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#E8843A'
                      e.target.style.boxShadow = '0 0 0 1px #E8843A'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ede8e1'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Pet Username / Handle (optional) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label
                      className="text-[11px] font-bold uppercase tracking-widest"
                      style={{ color: '#476558' }}
                    >
                      Pet Username
                    </label>
                    <span className="text-[11px] font-medium text-[#887366]">(optional)</span>
                  </div>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[15px]"
                      style={{ color: '#887366' }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="bruno_the_lab"
                      value={petUsername}
                      onChange={(e) =>
                        setPetUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
                      }
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                      style={{ background: '#fff', borderColor: '#ede8e1', color: '#1d1b18' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E8843A'
                        e.target.style.boxShadow = '0 0 0 1px #E8843A'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ede8e1'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  {petUsername && petUsername.length >= 3 && (
                    <div className="flex items-center gap-1.5 text-[12px] font-medium pl-1">
                      {isCheckingUsername ? (
                        <>
                          <span className="material-symbols-outlined animate-spin" style={{ fontSize: '14px', color: '#887366' }}>
                            progress_activity
                          </span>
                          <span style={{ color: '#887366' }}>Checking availability...</span>
                        </>
                      ) : usernameError ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>
                            error
                          </span>
                          <span style={{ color: '#ba1a1a' }}>{usernameError}</span>
                        </>
                      ) : usernameAvailable ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#476558', fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                          <span style={{ color: '#476558' }}>furlo.in/@{petUsername} is available!</span>
                        </>
                      ) : null}
                    </div>
                  )}
                  {petUsername && petUsername.length > 0 && petUsername.length < 3 && (
                    <p className="text-[12px] pl-1" style={{ color: '#887366' }}>
                      Username must be at least 3 characters if provided.
                    </p>
                  )}
                </div>

                {/* SPECIES Pill Selector */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: '#1C2329', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    SPECIES
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {PET_TYPE_OPTIONS.map((typeOption) => {
                      const isSelected = petType === typeOption.id
                      return (
                        <button
                          key={typeOption.id}
                          type="button"
                          onClick={() => {
                            setPetType(typeOption.id)
                            setBreed('')
                            setCustomBreed('')
                          }}
                          className="h-[44px] px-5 rounded-full text-[14px] font-medium transition-all duration-150 flex items-center justify-center gap-2"
                          style={{
                            background: isSelected ? '#E8843A' : '#FFFBF7',
                            color: isSelected ? '#ffffff' : '#1C2329',
                            border: isSelected ? 'none' : '1px solid #EDE8E1',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                          }}
                        >
                          <PetTypeIcon type={typeOption.id} />
                          {typeOption.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom Pet Type Input when 'Other' selected */}
                  {petType === 'other' && (
                    <div className="mt-1 flex flex-col gap-1">
                      <input
                        type="text"
                        required
                        placeholder="Type species name (e.g. Turtle, Guinea Pig)..."
                        value={customPetType}
                        onChange={(e) => setCustomPetType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all"
                        style={{ background: '#fff', borderColor: '#E8843A', color: '#1d1b18' }}
                      />
                    </div>
                  )}
                </div>

                {/* Breed & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Searchable Breed */}
                  <div className="flex flex-col gap-1.5 relative" ref={breedDropdownRef}>
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                      Breed
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        disabled={!petType}
                        required={Boolean(petType && breed !== 'Other')}
                        placeholder={!petType ? "Select pet type first..." : "Select breed..."}
                        value={
                          !petType
                            ? ''
                            : isBreedDropdownOpen
                            ? breedSearchQuery
                            : breed === 'Other'
                            ? customBreed
                              ? `Other: ${customBreed}`
                              : 'Other'
                            : breed
                        }
                        onFocus={() => {
                          if (petType) {
                            setIsBreedDropdownOpen(true)
                            setBreedSearchQuery('')
                          }
                        }}
                        onChange={(e) => {
                          if (petType) {
                            setBreedSearchQuery(e.target.value)
                            if (!isBreedDropdownOpen) setIsBreedDropdownOpen(true)
                          }
                        }}
                        className="w-full pl-4 pr-10 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                        style={{
                          background: !petType ? '#f7f4f0' : '#fff',
                          borderColor: breed ? '#974900' : '#ede8e1',
                          color: !petType ? '#9c9088' : '#1d1b18',
                          cursor: !petType ? 'not-allowed' : 'pointer',
                        }}
                      />
                      <span
                        className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ fontSize: '18px', color: !petType ? '#c2b8b0' : '#887366' }}
                      >
                        {isBreedDropdownOpen ? 'unfold_less' : 'search'}
                      </span>
                    </div>

                    {/* Breed Dropdown Menu */}
                    {isBreedDropdownOpen && petType && (
                      <div
                        className="absolute left-0 right-0 top-[102%] z-50 max-h-60 overflow-y-auto rounded-xl border shadow-xl bg-white p-1 flex flex-col gap-0.5"
                        style={{ borderColor: '#E8843A' }}
                      >
                        {filteredBreeds.length > 0 ? (
                          filteredBreeds.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setBreed(item)
                                setIsBreedDropdownOpen(false)
                                if (item !== 'Other') setCustomBreed('')
                              }}
                              className="w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] hover:bg-[#fdf8f2] transition-colors flex items-center justify-between"
                              style={{
                                color: breed === item ? '#974900' : '#1d1b18',
                                fontWeight: breed === item ? 700 : 400,
                              }}
                            >
                              <span>{item}</span>
                              {breed === item && (
                                <span className="material-symbols-outlined text-[16px] text-[#974900]">check</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-[13px] text-[#887366] text-center">
                            No breed matches found. Choose "Other" below to type custom breed.
                          </div>
                        )}

                        {/* Always include Other option */}
                        {!filteredBreeds.includes('Other') && (
                          <button
                            type="button"
                            onClick={() => {
                              setBreed('Other')
                              setIsBreedDropdownOpen(false)
                            }}
                            className="w-full text-left px-3.5 py-2.5 rounded-lg text-[14px] font-semibold text-[#974900] hover:bg-[#fdf8f2] transition-colors border-t border-[#ede8e1]"
                          >
                            + Other (Enter custom breed)
                          </button>
                        )}
                      </div>
                    )}

                    {/* Custom Breed Input field when 'Other' is selected */}
                    {breed === 'Other' && (
                      <div className="mt-1 flex flex-col gap-1">
                        <input
                          type="text"
                          required
                          placeholder="Type custom breed name..."
                          value={customBreed}
                          onChange={(e) => setCustomBreed(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border text-[14px] outline-none transition-all"
                          style={{ background: '#fff', borderColor: '#E8843A', color: '#1d1b18' }}
                        />
                        <span className="text-[10px] text-[#887366]">
                          Custom breed will be saved & submitted for admin catalog approval.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                      Gender
                    </label>
                    <div
                      className="flex rounded-xl p-1"
                      style={{ background: '#f2ede7', height: '50px' }}
                    >
                      {genderOptions.map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setGender(g.value as any)}
                          className="flex-1 rounded-lg text-[13px] font-medium transition-all"
                          style={{
                            background: gender === g.value ? '#fff' : 'transparent',
                            color: gender === g.value ? '#974900' : '#554338',
                            fontWeight: gender === g.value ? 700 : 500,
                            boxShadow: gender === g.value ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                          }}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-4 pr-10 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                      style={{ background: '#fff', borderColor: '#ede8e1', color: '#1d1b18' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E8843A'
                        e.target.style.boxShadow = '0 0 0 1px #E8843A'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ede8e1'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <span
                      className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ fontSize: '18px', color: '#887366', fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Display Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                    style={{ background: '#fff', borderColor: '#ede8e1', color: '#1d1b18' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#E8843A'
                      e.target.style.boxShadow = '0 0 0 1px #E8843A'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#ede8e1'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {/* Username (optional) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                      Username
                    </label>
                    <span className="text-[11px] font-medium text-[#887366]">(optional)</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-[15px]" style={{ color: '#887366' }}>
                      @
                    </span>
                    <input
                      type="text"
                      placeholder="alex_loves_dogs"
                      value={loverUsername}
                      onChange={(e) => setLoverUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full pl-8 pr-4 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                      style={{ background: '#fff', borderColor: '#ede8e1', color: '#1d1b18' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E8843A'
                        e.target.style.boxShadow = '0 0 0 1px #E8843A'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ede8e1'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                  {loverUsername && loverUsername.length >= 3 && (
                    <div className="flex items-center gap-1.5 text-[12px] font-medium pl-1">
                      {isCheckingUsername ? (
                        <>
                          <span className="material-symbols-outlined animate-spin" style={{ fontSize: '14px', color: '#887366' }}>
                            progress_activity
                          </span>
                          <span style={{ color: '#887366' }}>Checking availability...</span>
                        </>
                      ) : usernameError ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>
                            error
                          </span>
                          <span style={{ color: '#ba1a1a' }}>{usernameError}</span>
                        </>
                      ) : usernameAvailable ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#476558', fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                          </span>
                          <span style={{ color: '#476558' }}>furlo.in/@{loverUsername} is available!</span>
                        </>
                      ) : null}
                    </div>
                  )}
                  {loverUsername && loverUsername.length > 0 && loverUsername.length < 3 && (
                    <p className="text-[12px] pl-1" style={{ color: '#887366' }}>
                      Username must be at least 3 characters if provided.
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#476558' }}>
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-4 pr-10 py-3.5 rounded-xl border text-[15px] outline-none transition-all"
                      style={{ background: '#fff', borderColor: '#ede8e1', color: '#1d1b18' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#E8843A'
                        e.target.style.boxShadow = '0 0 0 1px #E8843A'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#ede8e1'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                    <span
                      className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ fontSize: '18px', color: '#887366', fontVariationSettings: "'FILL' 1" }}
                    >
                      location_on
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <div className="pt-2">
              <button
                id="btn-profile-continue"
                type="submit"
                disabled={isCheckingUsername || usernameAvailable === false}
                className="w-full py-4 rounded-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: '#E8843A',
                  color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  boxShadow: '0 4px 24px rgba(232,132,58,0.3)',
                }}
              >
                Continue
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(40px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
