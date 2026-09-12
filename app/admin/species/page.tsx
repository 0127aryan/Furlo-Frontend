'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface SpeciesVerb {
  id: string
  species: string
  label: string
  verb: string
  icon?: string
  is_active: boolean
  updated_at?: string
}

export default function AdminSpeciesVerbsPage() {
  const [speciesList, setSpeciesList] = useState<SpeciesVerb[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // New form state
  const [newSpecies, setNewSpecies] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [newVerb, setNewVerb] = useState('')
  const [newIcon, setNewIcon] = useState('pets')
  const [isAdding, setIsAdding] = useState(false)

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editVerb, setEditVerb] = useState('')

  const fetchSpeciesVerbs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch('/admin/species-verbs')
      if (Array.isArray(data)) {
        setSpeciesList(data)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load species verbs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpeciesVerbs()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSpecies || !newLabel || !newVerb || isAdding) return

    setIsAdding(true)
    setError(null)
    setMessage(null)

    try {
      const res = await apiFetch('/admin/species-verbs', {
        method: 'POST',
        json: {
          species: newSpecies,
          label: newLabel,
          verb: newVerb,
          icon: newIcon,
        },
      })

      setMessage('New species verb mapping added successfully!')
      setNewSpecies('')
      setNewLabel('')
      setNewVerb('')
      fetchSpeciesVerbs()
    } catch (err: any) {
      setError(err.message || 'Failed to create species verb.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleSaveEdit = async (id: string) => {
    try {
      await apiFetch(`/admin/species-verbs/${id}`, {
        method: 'PUT',
        json: {
          label: editLabel,
          verb: editVerb,
        },
      })
      setMessage('Updated species verb successfully!')
      setEditingId(null)
      fetchSpeciesVerbs()
    } catch (err: any) {
      setError(err.message || 'Failed to update species verb.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this species verb mapping?')) return
    try {
      await apiFetch(`/admin/species-verbs/${id}`, {
        method: 'DELETE',
      })
      setMessage('Species verb mapping deleted.')
      fetchSpeciesVerbs()
    } catch (err: any) {
      setError(err.message || 'Failed to delete species verb.')
    }
  }

  return (
    <div className="min-h-screen bg-[#151c22] text-[#e2e9f1] p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#304d40] pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/breeds"
              className="px-3 py-1.5 bg-[#2d4a3e] hover:bg-[#476558] text-white rounded-lg text-[13px] font-medium transition-colors"
            >
              ← Admin Breeds
            </Link>
            <h1 className="text-2xl font-bold text-[#ffb688]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Species &amp; Comment Verbs Management
            </h1>
          </div>
          <span className="px-3 py-1 bg-[#2d4a3e] text-[#adcebe] rounded-full text-xs font-semibold uppercase tracking-wider">
            Admin Database Config
          </span>
        </div>

        {/* Banners */}
        {error && (
          <div className="p-4 bg-[#ba1a1a]/20 border border-[#ba1a1a] text-[#ffdad6] rounded-xl text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="p-4 bg-[#166534]/20 border border-[#22c55e] text-[#bbf7d0] rounded-xl text-sm">
            {message}
          </div>
        )}

        {/* Add New Species Verb Form */}
        <form onSubmit={handleAdd} className="bg-[#1c2329] p-6 rounded-2xl border border-[#304d40] space-y-4 shadow-lg">
          <h2 className="text-lg font-bold text-[#c9ead9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            + Add New Species &amp; Comment Verb
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#adcebe] uppercase tracking-wider mb-1">
                Species ID (e.g. iguana)
              </label>
              <input
                type="text"
                required
                placeholder="iguana"
                value={newSpecies}
                onChange={(e) => setNewSpecies(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#151c22] border border-[#424844] rounded-xl text-sm text-white focus:outline-none focus:border-[#E8843A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#adcebe] uppercase tracking-wider mb-1">
                Display Label (e.g. Iguana)
              </label>
              <input
                type="text"
                required
                placeholder="Iguana"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#151c22] border border-[#424844] rounded-xl text-sm text-white focus:outline-none focus:border-[#E8843A]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#adcebe] uppercase tracking-wider mb-1">
                Comment Verb (e.g. Hiss)
              </label>
              <input
                type="text"
                required
                placeholder="Hiss"
                value={newVerb}
                onChange={(e) => setNewVerb(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#151c22] border border-[#424844] rounded-xl text-sm text-white focus:outline-none focus:border-[#E8843A]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-2.5 bg-[#E8843A] hover:bg-[#ffb688] text-[#311300] font-bold rounded-xl text-sm transition-all"
              >
                {isAdding ? 'Adding...' : 'Add Mapping'}
              </button>
            </div>
          </div>
        </form>

        {/* Existing Species Table */}
        <div className="bg-[#1c2329] rounded-2xl border border-[#304d40] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#304d40] flex justify-between items-center">
            <h2 className="text-lg font-bold text-[#c9ead9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Database Species Verb Mappings ({speciesList.length})
            </h2>
            <button
              onClick={fetchSpeciesVerbs}
              className="text-xs text-[#adcebe] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span> Reload
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-[#887366]">Loading database records...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#e2e9f1]">
                <thead>
                  <tr className="bg-[#151c22] border-b border-[#304d40] text-[#adcebe] uppercase text-xs">
                    <th className="p-4">Species Key</th>
                    <th className="p-4">Display Label</th>
                    <th className="p-4">Comment Verb</th>
                    <th className="p-4 text-center">Preview Output</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#304d40]">
                  {speciesList.map((item) => {
                    const isEditing = editingId === item.id
                    return (
                      <tr key={item.id} className="hover:bg-[#151c22]/50 transition-colors">
                        <td className="p-4 font-mono text-[#ffb688] font-bold">
                          {item.species}
                        </td>
                        <td className="p-4 font-semibold">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="px-2.5 py-1 bg-[#151c22] border border-[#E8843A] rounded-lg text-sm"
                            />
                          ) : (
                            item.label
                          )}
                        </td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editVerb}
                              onChange={(e) => setEditVerb(e.target.value)}
                              className="px-2.5 py-1 bg-[#151c22] border border-[#E8843A] rounded-lg text-sm"
                            />
                          ) : (
                            <span className="px-3 py-1 bg-[#2d4a3e] text-[#c9ead9] rounded-full text-xs font-bold">
                              {item.verb}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center text-xs text-[#887366]">
                          &quot;14 Sniffs&quot; • &quot;Add a sniff as @pet...&quot;
                        </td>
                        <td className="p-4 text-right">
                          {isEditing ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="px-3 py-1 bg-[#22c55e] text-white rounded-lg text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1 bg-[#424844] text-white rounded-lg text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(item.id)
                                  setEditLabel(item.label)
                                  setEditVerb(item.verb)
                                }}
                                className="px-3 py-1 bg-[#2d4a3e] hover:bg-[#476558] text-[#adcebe] rounded-lg text-xs font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1 bg-[#ba1a1a]/20 hover:bg-[#ba1a1a] text-[#ffdad6] rounded-lg text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
