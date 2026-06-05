'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styles from './WaitlistForm.module.css'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  email: z.string().email('Enter a valid email address'),
  is_pet_parent: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_pet_parent: true },
  })

  const isPetParent = watch('is_pet_parent')

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (res.ok) {
        setStatus('success')
        setResponseMessage(json.message)
        reset()
      } else {
        setStatus('error')
        setResponseMessage(json.error ?? 'Something went wrong.')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setResponseMessage('Network error. Please try again.')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>🐾</div>
        <h3 className={styles.successTitle}>{responseMessage}</h3>
        <p className={styles.successDesc}>Spread the word to fellow pet parents!</p>
        <button
          onClick={() => setStatus('idle')}
          className={styles.successResetButton}
        >
          Add another email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {/* Name + City */}
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <input
            {...register('name')}
            id="waitlist-name"
            type="text"
            placeholder="Your Name"
            className={styles.input}
          />
          {errors.name && (
            <p className={styles.errorText}>⚠ {errors.name.message}</p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <input
            {...register('city')}
            id="waitlist-city"
            type="text"
            placeholder="Your City"
            className={styles.input}
          />
          {errors.city && (
            <p className={styles.errorText}>⚠ {errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className={styles.inputGroup}>
        <input
          {...register('email')}
          id="waitlist-email"
          type="email"
          placeholder="Enter your email"
          className={styles.input}
        />
        {errors.email && (
          <p className={styles.errorText}>⚠ {errors.email.message}</p>
        )}
      </div>

      {/* Pet Parent Radio */}
      <div className={styles.radioGroup}>
        <p className={styles.radioGroupTitle}>Are you a pet parent?</p>
        <div className={styles.radioOptions}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              id="pet-parent-yes"
              name="is_pet_parent_radio"
              checked={isPetParent === true}
              onChange={() => setValue('is_pet_parent', true)}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>Yes</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              id="pet-parent-no"
              name="is_pet_parent_radio"
              checked={isPetParent === false}
              onChange={() => setValue('is_pet_parent', false)}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>
              No, but I love pets!
            </span>
          </label>
        </div>
      </div>

      {/* Error banner */}
      {status === 'error' && (
        <div className={styles.errorBanner}>
          ⚠ {responseMessage}
        </div>
      )}

      {/* Submit */}
      <button
        id="waitlist-submit"
        type="submit"
        disabled={status === 'loading'}
        className={styles.submitButton}
      >
        {status === 'loading' ? (
          <>
            <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Joining...
          </>
        ) : (
          'Join Waitlist 🐾'
        )}
      </button>
    </form>
  )
}
