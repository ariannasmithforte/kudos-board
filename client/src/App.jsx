import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {
  // Functions to handle search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');


  // Placeholder data for now
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'Team Celebration',
      image: 'https://picsum.photos/200/300',
      category: 'Celebration',
      createdAt: new Date('2025-06-14T10:00:00'),
    },
    {
      id: 2,
      title: 'Thank You Notes',
      image: 'https://picsum.photos/200/300',
      category: 'Thank You',
      createdAt: new Date('2025-06-12T14:00:00'),
    },
    {
      id: 3,
      title: 'Morning Motivation',
      image: 'https://picsum.photos/200/300',
      category: 'Inspiration',
      createdAt: new Date('2025-06-16T09:00:00'),
    }
  ]);

  // Functions to handle search and clear
  const handleSearch = () => {
    setConfirmedSearchTerm(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    setConfirmedSearchTerm('');
    setFilter('All');
  };

  // Functions to handle delete and view
  const handleDelete = (id) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
  };

  // TO DO : Add view function later
  const handleView = (id) => {
    ;
  };


  // Logic to filter and sort the boards
  let filteredBoards = boards.filter((board) => {
    return board.title.toLowerCase().includes(confirmedSearchTerm.toLowerCase());
  });

  if (filter === 'Celebration') {
    filteredBoards = filteredBoards.filter((board) => board.category === 'Celebration');
  } else if (filter === 'Thank You') {
    filteredBoards = filteredBoards.filter((board) => board.category === 'Thank You');
  } else if (filter === 'Inspiration') {
    filteredBoards = filteredBoards.filter((board) => board.category === 'Inspiration');
  } else if (filter === 'Recent') {
    filteredBoards = filteredBoards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }


  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleClear={handleClear}
        setFilter={setFilter}
      />
      <Dashboard
        boards={filteredBoards}
        handleDelete={handleDelete}
        handleView={handleView}
      />

    </>
  )
}

export default App;
