'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'

interface CreatePackModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newPack: any) => void
}

const CATEGORY_OPTIONS = [
  'Dog Breeds',
  'Local Meetups',
  'Nutrition & Diet',
  'Puppy Training',
  'Senior Dogs',
  'Special Care',
  'General Play',
  'Other',
]

export function CreatePackModal({ isOpen, onClose, onSuccess }: CreatePackModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Dog Breeds')
  const [customCategory, setCustomCategory] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [coverPhoto, setCoverPhoto] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPhoto(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a pack name')
      return
    }
    if (category === 'Other' && !customCategory.trim()) {
      toast.error('Please enter your custom category name')
      return
    }

    const finalCategory = category === 'Other' ? customCategory.trim() : category

    setLoading(true)
    try {
      const data = await apiFetch<{ success: boolean; community: any }>('/communities/create', {
        method: 'POST',
        json: {
          name: name.trim(),
          category: finalCategory,
          city: location.trim(),
          location_city: location.trim(),
          description: description.trim(),
          coverData: coverPhoto,
          cover_image_url: coverPhoto,
        },
      })

      if (data && data.community) {
        toast.success(`Pack "${data.community.name}" created! Submitted for Super Admin approval & verification. 🐾`)
        if (onSuccess) onSuccess(data.community)
        onClose()
        setName('')
        setCategory('Dog Breeds')
        setCustomCategory('')
        setDescription('')
        setLocation('')
        setCoverPhoto('')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create pack')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FEF9F3] w-full max-w-lg rounded-3xl shadow-2xl border border-[#EDE8E1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EDE8E1] bg-white">
          <h2 className="text-[20px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Create a Pack 🐾
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#727974] hover:text-[#011E14] hover:bg-[#f8f3ed] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Cover Photo Upload */}
          <div>
            <label className="block text-[13px] font-bold text-[#011E14] mb-2">
              Cover Photo
            </label>
            <div className="relative w-full h-36 rounded-2xl border-2 border-dashed border-[#EDE8E1] bg-[#F8F3ED] hover:bg-[#f2eae0] transition-colors flex items-center justify-center overflow-hidden cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {coverPhoto ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={coverPhoto} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-[#727974]">
                  <span className="material-symbols-outlined text-[32px] text-[#E8843A]">
                    add_photo_alternate
                  </span>
                  <span className="text-[13px] font-medium">Tap to upload cover photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Pack Name */}
          <div>
            <label className="block text-[13px] font-bold text-[#011E14] mb-1.5">
              Pack Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Weekend Warriors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE8E1] bg-white text-[14px] text-[#011E14] focus:outline-none focus:border-[#E8843A] transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[13px] font-bold text-[#011E14] mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE8E1] bg-white text-[14px] text-[#011E14] focus:outline-none focus:border-[#E8843A] transition-colors"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {category === 'Other' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  required
                  placeholder="Type custom category (e.g. Agility, Rescue)..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#EDE8E1] bg-white text-[14px] text-[#011E14] focus:outline-none focus:border-[#E8843A] transition-colors"
                />
              </div>
            )}
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-[13px] font-bold text-[#011E14] mb-1.5">
              City / Location (Optional)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#727974] text-[20px]">
                location_on
              </span>
              <input
                type="text"
                placeholder="e.g. Bengaluru, KA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EDE8E1] bg-white text-[14px] text-[#011E14] focus:outline-none focus:border-[#E8843A] transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[13px] font-bold text-[#011E14]">
                Description
              </label>
              <span className="text-[12px] text-[#727974]">
                🐾 {description.length}/300
              </span>
            </div>
            <textarea
              maxLength={300}
              rows={3}
              placeholder="Tell others what this pack is all about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#EDE8E1] bg-white text-[14px] text-[#011E14] focus:outline-none focus:border-[#E8843A] transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3.5 bg-[#E8843A] hover:bg-[#974900] text-white font-bold text-[15px] rounded-full transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
            ) : (
              <span>Create Pack 🐾</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
