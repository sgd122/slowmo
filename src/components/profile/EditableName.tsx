'use client'

import { useState } from 'react'
import { Pencil, Check, X } from 'lucide-react'
import { updateMemberName } from '@/actions/member'

interface EditableNameProps {
  initialName: string
}

export function EditableName({ initialName }: EditableNameProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!name.trim() || name === initialName) {
      setName(initialName)
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    try {
      await updateMemberName(name)
      setIsEditing(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.')
      setName(initialName)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setName(initialName)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isLoading}
          className="text-2xl font-bold text-white bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          maxLength={50}
        />
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-bold text-white">{name}</h1>
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  )
}
