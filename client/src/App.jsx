import { useState, useEffect } from 'react'
import './App.css'
import Header, { Sidebar } from './components/Header.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddBoardModal from './components/AddBoardModal.jsx'
import Footer from './components/Footer.jsx'
import ViewBoardDetails from './components/ViewBoardDetails.jsx';
import {Routes, Route, useNavigate} from 'react-router-dom';




function App() {
  // Functions to handle search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const navigate = useNavigate();

 // State to store the list of boards
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch boards from server on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch('http://localhost:8000/boards');
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      } else {
        console.error('Failed to fetch boards');
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };


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
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/boards/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
      } else {
        console.error('Failed to delete board');
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
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
  const addNewBoard = async (newBoard) => {
    try {
      const response = await fetch('http://localhost:8000/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBoard),
      });
      if (response.ok) {
        const createdBoard = await response.json();
        setBoards((prevBoards) => [...prevBoards, createdBoard]);
      } else {
        console.error('Failed to create board');
      }
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };


  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />

              <div className="main-layout">
                <Sidebar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleSearch={handleSearch}
                  handleClear={handleClear}
                  setFilter={setFilter}
                  onAddNewBoard={() => setShowAddBoardModal(true)}
                />

                <div className="content-area">
                  {loading ? (
                    <div>Loading boards...</div>
                  ) : (
                    <Dashboard
                      boards={filteredBoards}
                      handleDelete={handleDelete}
                      handleView={handleView}
                    />
                  )}
                </div>
              </div>

              {showAddBoardModal && (
                <AddBoardModal
                  onClose={() => setShowAddBoardModal(false)}
                  onCreate={addNewBoard}
                />
              )}

              <Footer />
            </>
          }
        />
        <Route path="/board/:id" element={<ViewBoardDetails />} />
      </Routes>
    </>
  )
}

export default App;
