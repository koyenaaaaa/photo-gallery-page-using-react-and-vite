import { useEffect, useRef, useState } from 'react'

function HeartIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
      />
    </svg>
  )
}

export default function PhotoCard({
  photo,
  isFavourite,
  onToggleFavourite,
}) {
  const cardRef = useRef(null)
  const [isVisible, setIsVisible] = useState(
    () =>
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window),
  )

  useEffect(() => {
    const card = cardRef.current

    if (!card) return undefined

    if (!('IntersectionObserver' in window)) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={cardRef}
      className={`photo-reveal group relative overflow-hidden rounded-2xl bg-stone-200 shadow-sm ${
        isVisible ? 'is-visible' : ''
      }`}
    >
      <img
        src={`https://picsum.photos/id/${photo.id}/700/900`}
        alt={`Photo by ${photo.author}`}
        loading="lazy"
        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <button
        type="button"
        onClick={() => onToggleFavourite(photo.id)}
        aria-label={
          isFavourite
            ? `Remove photo by ${photo.author} from favourites`
            : `Add photo by ${photo.author} to favourites`
        }
        aria-pressed={isFavourite}
        className={`absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
          isFavourite
            ? 'text-red-500'
            : 'text-stone-700 hover:text-red-500'
        }`}
      >
        <HeartIcon filled={isFavourite} />
      </button>
      <p className="sr-only">Photo by {photo.author}</p>
    </article>
  )
}
