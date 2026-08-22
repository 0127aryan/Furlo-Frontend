'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore, Pet } from '@/store/useAuthStore'

interface EditPetProfileModalProps {
  isOpen: boolean
  onClose: () => void
  pet: {
    id: string
    name: string
    username?: string
    breed: string
    city: string
    bio?: string
    profile_image_url?: string
    personality_tags?: string[]
  }
  onSuccess: (updatedPet: any) => void
}

export function EditPetProfileModal({
  isOpen,
  onClose,
  pet,
  onSuccess,
}: EditPetProfileModalProps) {
  const { setActivePet } = useAuthStore()

  const [name, setName] = useState(pet.name)
  const [username, setUsername] = useState(pet.username || '')
  const [breed, setBreed] = useState(pet.breed)
  const [city, setCity] = useState(pet.city)
  const [bio, setBio] = useState(pet.bio || '')
  const [tagsText, setTagsText] = useState((pet.personality_tags || []).join(', '))
  const [avatarData, setAvatarData] = useState<string | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>(pet.profile_image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatarData(result)
      setPreviewUrl(result)
      setRemoveAvatar(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePhoto = () => {
    setPreviewUrl('')
    setAvatarData('')
    setRemoveAvatar(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const personalityTags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)

    try {
      const data = await apiFetch<{ pet: Pet }>('/auth/update-pet-profile', {
        method: 'PUT',
        json: {
          petId: pet.id,
          name,
          username: username.trim(),
          breed,
          city,
          bio,
          personalityTags,
          ...(removeAvatar
            ? { removeAvatar: true, avatarData: '' }
            : avatarData
            ? { avatarData }
            : {}),
        },
      })

      if (data && data.pet) {
        setActivePet(data.pet)
        onSuccess(data.pet)
        onClose()
      } else {
        setError('Failed to update profile')
      }
    } catch (err: any) {
      console.error('[EditPetProfileModal] Error:', err)
      setError(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FEF9F3] w-full max-w-lg rounded-[24px] shadow-2xl border border-[#EDE8E1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E1] bg-white">
          <h2 className="text-[20px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Edit Pet Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727974] hover:text-[#011E14] hover:bg-[#f8f3ed] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-xl text-[13px] font-medium">
              {error}
            </div>
          )}

          {/* Avatar Upload & Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group cursor-pointer">
              {previewUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewUrl}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#f8f3ed] border-4 border-white shadow-md flex items-center justify-center text-[#E8843A]">
                  <span className="material-symbols-outlined text-[40px]">pets</span>
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
              >
                <span className="material-symbols-outlined text-[24px]">photo_camera</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-3 text-[12px] font-semibold">
              <label
                htmlFor="avatar-upload"
                className="text-[#E8843A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">upload</span>
                <span>{previewUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </label>

              {previewUrl && (
                <>
                  <span className="text-[#EDE8E1]">|</span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-[#ba1a1a] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Remove Photo</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-[14px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#424844] mb-1">Pet Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#EDE8E1] rounded-full px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E]"
                  required
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#424844] mb-1">Username Handle</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-[#EDE8E1] rounded-full px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E]"
                  placeholder="e.g. bruno_the_lab"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#424844] mb-1">Breed</label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full bg-white border border-[#EDE8E1] rounded-full px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#424844] mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-[#EDE8E1] rounded-full px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#424844] mb-1">Personality Tags (comma separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full bg-white border border-[#EDE8E1] rounded-full px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E]"
                placeholder="Active, Playful, Cuddly, WaterLover"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#424844] mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full bg-white border border-[#EDE8E1] rounded-2xl px-4 py-2 text-[#011E14] focus:outline-none focus:border-[#2D4A3E] resize-none"
                placeholder="Share what makes your companion special..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDE8E1]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-[13px] font-bold text-[#424844] hover:bg-[#f8f3ed]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-full text-[13px] font-bold bg-[#E8843A] text-white hover:bg-[#974900] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
