'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface User {
    id: string
    email?: string
}

export default function DashboardComponent() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
            } catch (error) {
                console.error('Error fetching user:', error)
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [])

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            window.location.href = '/'
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                        Welcome, {user?.email || 'User'}
                    </h2>
                    <p className="text-slate-600">
                        This is your dashboard. You can add your content here.
                    </p>

                    {/* Example Stats Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                                <h3 className="text-sm font-medium text-blue-900">Stat {i}</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">0</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
