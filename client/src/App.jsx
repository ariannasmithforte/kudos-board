import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  // TO DO : Finish filter logic later
  const [filter, setFilter] = useState('All')

  const handleSearch = () => {
    console.log('Searching for', searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('')
  };

  return (
    <>
    <Header
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearch={handleSearch}
      handleClear={handleClear}
      setFilter={setFilter}
    />
        
    </>
  )
}

export default App;
