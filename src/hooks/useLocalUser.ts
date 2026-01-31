'use client'

import { useState, useEffect, useCallback } from 'react'

const LOCAL_STORAGE_KEY = 'mogakco-user'

interface LocalUser {
  memberId: string
  memberName: string
  nickname?: string
  currentParticipantId?: string
}

export function useLocalUser() {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveUser = useCallback((userData: LocalUser) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
    setUser(userData)
  }, [])

  const clearUser = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setUser(null)
  }, [])

  const isOwner = useCallback((participantId: string) => {
    return user?.currentParticipantId === participantId
  }, [user])

  return { user, isLoaded, saveUser, clearUser, isOwner }
}
