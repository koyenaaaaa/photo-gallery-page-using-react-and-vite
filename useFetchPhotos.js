import { useEffect, useState } from 'react'

export function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPhotos() {
      try {
        const response = await fetch(
          'https://picsum.photos/v2/list?page=2&limit=32',
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Photo service returned ${response.status}`)
        }

        const result = await response.json()

        if (
          !Array.isArray(result) ||
          !result.every(
            (photo) =>
              (typeof photo.id === 'string' ||
                typeof photo.id === 'number') &&
              typeof photo.author === 'string',
          )
        ) {
          throw new Error('Photo service returned invalid photo data')
        }

        setPhotos(result)
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'An unknown error occurred',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPhotos()

    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
