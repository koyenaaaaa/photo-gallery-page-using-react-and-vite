import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import './App.css'
import PhotoCard from './components/PhotoCard.jsx'
import { useFetchPhotos } from './hooks/useFetchPhotos.js'
import {
  favouritesReducer,
  readSavedFavourites,
} from './reducers/favouritesReducer.js'

function LoadingSpinner() {
  return (
    <div
      className="flex min-h-56 flex-col items-center justify-center gap-4 text-stone-500"
      role="status"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      <span className="text-sm">Loading photos…</span>
    </div>
  )
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [searchText, setSearchText] = useState('')
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    readSavedFavourites,
  )

  useEffect(() => {
    try {
      localStorage.setItem(
        'photo-gallery-favourites',
        JSON.stringify(favourites),
      )
    } catch (storageError) {
      console.error('Could not save favourites:', storageError)
    }
  }, [favourites])

  const handleSearch = useCallback((event) => {
    setSearchText(event.target.value)
  }, [])

  const filteredPhotos = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    if (!query) return photos

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query),
    )
  }, [photos, searchText])

  const toggleFavourite = useCallback((photoId) => {
    dispatch({ type: 'toggle', photoId })
  }, [])

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-stone-900">
      <div className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
        <header className="mb-8 flex flex-col gap-6 border-b border-stone-200 pb-8 sm:mb-10 sm:flex-row sm:items-center sm:justify-between lg:mb-12 lg:pb-10">
          <div>
            
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Photo Gallery
            </h1>
          </div>

          <label className="block w-full sm:max-w-sm lg:w-80">
            <span className="sr-only">Search by author</span>
            <input
              type="search"
              value={searchText}
              onChange={handleSearch}
              placeholder="Search by author"
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
            />
          </label>
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
          >
            Could not load photos: {error}
          </p>
        ) : filteredPhotos.length === 0 ? (
          <p className="py-16 text-center text-sm text-stone-500">
            No photos match that author.
          </p>
        ) : (
          <section
            aria-label="Photo gallery"
            className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-7"
          >
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}