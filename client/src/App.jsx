import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddBoardModal from './components/AddBoardModal.jsx'
import Footer from './components/Footer.jsx'
import ViewBoardDetails from './ViewBoardDetails.jsx';
import {Routes, Route, useNavigate} from 'react-router-dom';




function App() {
  // Functions to handle search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const navigate = useNavigate();


  // Placeholder data for now
  const [boards, setBoards] = useState([
    {
      id: 1,
      title: 'Team Celebration',
      image: 'https://picsum.photos/200/300',
      category: 'Celebration',
      createdAt: new Date('2025-06-14T10:00:00'),
      cards: [
        {
          id: 1,
          title: '🎉 Great Job!',
          description: 'Big shoutout to the dev team for crushing the deadline!',
          gif: 'https://media.giphy.com/media/26BRzozg4TCBXv6QU/giphy.gif',
          likes: 3,
        },
        {
          id: 2,
          title: '👏 Applause!',
          description: 'Let’s celebrate Sarah’s promotion! 🎉',
          gif: 'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
          likes: 5,
        }
      ]
    },
    {
      id: 2,
      title: 'Thank You Notes',
      image: 'https://picsum.photos/200/300',
      category: 'Thank You',
      createdAt: new Date('2025-06-12T14:00:00'),
      cards: [
        {
          id: 1,
          title: 'Thank you, IT!',
          description: 'Thanks for fixing my laptop in 15 mins flat!',
          gif: 'https://media.giphy.com/media/xUPGcxpCV81ebKhGxy/giphy.gif',
          likes: 2,
        },
        {
          id: 2,
          title: 'Props to Janice!',
          description: 'She stayed late to help me finish my slides. 🧡',
          gif: 'https://media.giphy.com/media/JltOMwYmi0VrO/giphy.gif',
          likes: 4,
        }
      ]
    },
    {
      id: 3,
      title: 'Morning Motivation',
      image: 'https://picsum.photos/200/300',
      category: 'Inspiration',
      createdAt: new Date('2025-06-16T09:00:00'),
      cards: [
        {
          id: 1,
          title: 'Start Strong 💪',
          description: 'Today is a new chance to be better. Go for it!',
          gif: 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
          likes: 6,
        },
        {
          id: 2,
          title: 'You Got This!',
          description: 'Don’t stop now — your breakthrough is coming.',
          gif: 'https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif',
          likes: 7,
        }
      ]
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


  const handleView = (id) => {
    navigate(`/board/${id}`);
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

  // Function to add a new board
  const addNewBoard = (newBoard) => {
    setBoards((prevBoards) => [...prevBoards, newBoard]);
  };


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                handleClear={handleClear}
                setFilter={setFilter}
                onAddNewBoard={() => setShowAddBoardModal(true)}
              />

              {showAddBoardModal && (
                <AddBoardModal
                  onClose={() => setShowAddBoardModal(false)}
                  onCreate={addNewBoard}
                />
              )}
              <Dashboard
                boards={filteredBoards}
                handleDelete={handleDelete}
                handleView={handleView}
              />
              <Footer />
            </>
          }
        />
        <Route path="/board/:id" element={<ViewBoardDetails boards={boards} />} />
      </Routes>
    </>
  )
}

export default App;
