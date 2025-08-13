"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function EmailVerifiedPage() {
  const [loading, setLoading] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          setError(error.message)
          setLoading(false)
          return
        }

        if (user && user.email_confirmed_at) {
          // Update user profile to verified status
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ 
              email_verified: true,
              status: 'active' 
            })
            .eq('id', user.id)

          if (updateError) {
            console.error('Error updating profile:', updateError)
          }

          setVerified(true)
        } else {
          setError('Email not verified or user not found')
        }
      } catch (err) {
        setError('An error occurred during verification')
        console.error('Verification error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkVerification()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {verified ? '✅ Email Verified!' : '❌ Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {verified ? (
            <>
              <p className="text-green-600">
                Your email has been successfully verified. You can now access your Academia account.
              </p>
              <Button 
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Continue to Login
              </Button>
            </>
          ) : (
            <>
              <p className="text-red-600">
                {error || 'Email verification failed. Please try again or contact support.'}
              </p>
              <Button 
                onClick={() => router.push('/auth')}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
