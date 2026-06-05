import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  city: z.string().min(2, 'City is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  is_pet_parent: z.boolean(),
})

export async function POST(request: NextRequest) {
  const backendApiUrl = process.env.BACKEND_API_URL

  if (!backendApiUrl) {
    return NextResponse.json(
      { error: 'Server configuration error. Please try again later.' },
      { status: 500 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = waitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(`${backendApiUrl}/api/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Backend request failed.' },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[waitlist proxy] Error forwarding to backend:', error)
    return NextResponse.json(
      { error: 'Could not connect to the backend service. Please try again later.' },
      { status: 500 }
    )
  }
}

