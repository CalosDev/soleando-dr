'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function SignOutButton() { const router = useRouter(); return <button className="sign-out-button" onClick={async () => { await authClient.signOut(); router.push('/admin/login'); router.refresh() }}>Salir</button> }
