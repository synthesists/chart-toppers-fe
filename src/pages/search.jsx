import { useEffect, useState } from "react";
import Link from 'next/link';

const getSearchResults = async (searchQuery) => searchQuery
  ? [
    { id: '25pd339V2rRJo84USlcSRP', name: 'JAWNY', imgUrl: 'https://i.scdn.co/image/1e15a039893b6c52cff67ce095dfbe2d4390c3a0' },
    { id: '7uwY65fDg3FVJ8MkJ5QuZK', name: 'Easy Life', imgUrl: 'https://i.scdn.co/image/746db6b773cdfcb41a243993f54b306e36ed989b' },
    { id: '4AzAfQNuAyKOFG4DZMsdAo', name: 'The Snuts', imgUrl: 'https://i.scdn.co/image/653b026ecff103df266b8d97e0d635619bd5dd67' },
  ]
  : [];

const ArtistCard = ({ artist }) => (
  <Link href={`/chart/${artist.id}`} >
    <a
      className={`c-card c-card--artist c-card--link`}
      >
      <div className="c-card__image-container">
        { artist.imgUrl && <img src={artist.imgUrl} /> }
      </div>
      <div className="c-card__inner">
        <div className="c-card__title">{artist.name}</div>
      </div>
    </a>
  </Link>
)

const generateArtistResults = (artists) => (
  <div>
    {artists.map((artist) => <ArtistCard artist={artist} />)}
  </div>
)

const SearchBar = ({ onSubmit }) => <button onClick={() => onSubmit('search Result')} >Search</button>

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getSearchResults(searchQuery).then(setSearchResults)
  }, [searchQuery])

  return (
    <div>
      <SearchBar onSubmit={setSearchQuery} />
      {generateArtistResults(searchResults)}
    </div>
  )
}

export default SearchPage;