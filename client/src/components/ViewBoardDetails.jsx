import React, { useState, useEffect } from 'react';
import '../App.css';
import Footer from './Footer';
// React router to switch between pages
import { useParams, useNavigate } from 'react-router-dom';

const ViewBoardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch board data from server
  useEffect(() => {
    fetchBoardDetails();
  }, [id]);

  // Function to fetch board details
  const fetchBoardDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/boards/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBoard(data);
        setCards(data.cards || []);
      } else {
        console.error('Failed to fetch board details');
      }
    } catch (error) {
      console.error('Error fetching board details:', error);
    } finally {
      setLoading(false);
    }
  };


  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gif, setGif] = useState('');
  const [gifSearch, setGifSearch] = useState('');
  const [gifResults, setGifResults] = useState([]);


  const [showModal, setShowModal] = useState(false);

  // Check if board is loading or not
  if (loading) {
    return <div>Loading board details...</div>;
  }

  if (!board) {
    return <div>Board not found</div>;
  }

  // Function to add new card to cards state
  const handleAddCard = async () => {
    const newCard = {
      title: title,
      description: description,
      gif: gif,
    };

    try {
      const response = await fetch(`http://localhost:8000/boards/${id}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const createdCard = await response.json();
        setCards((prev) => [...prev, createdCard]); // Add new card to list
        setTitle(''); // Reset form fields
        setDescription('');
        setGif('');
      } else {
        console.error('Failed to create card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  // Function to increment likes on a card
  const handleLike = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:8000/cards/${cardId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedCard = await response.json();
        setCards((prev) =>
          prev.map((card) => (card.id === cardId ? updatedCard : card))
        );
      } else {
        console.error('Failed to like card');
      }
    } catch (error) {
      console.error('Error liking card:', error);
    }
  };

  // Function to delete a card
  const handleDelete = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:8000/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCards((prev) => prev.filter((card) => card.id !== cardId));
      } else {
        console.error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  // Function to search Giphy API for GIFs
  const handleGifSearch = async () => {
    const apiKey = import.meta.env.VITE_GIPHY_API_KEY; // Your Giphy API key stored in .env file
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${gifSearch}&limit=6&offset=0&rating=G&lang=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGifResults(data.data);
    } catch (error) {
      console.error('Error fetching GIF', error);
    }
  };

  return (
    <>
      <div className="board-detail">
        <h1>{board.title}</h1>
        <button onClick={() => navigate(-1)}>Back</button>


        <button className="add-card-button" onClick={() => setShowModal(true)}>
          + Add Card
        </button>


        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setShowModal(false)}>
                ×
              </button>
              <h3>Add a Card</h3>


              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />


              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />


              <input
                type="text"
                placeholder="Search for a GIF.."
                value={gifSearch}
                onChange={(e) => setGifSearch(e.target.value)}
              />
              <button onClick={handleGifSearch}>Search</button>

              <div className="gif-results">
                {gifResults.map((gifItem) => (
                  <img
                    key={gifItem.id}
                    src={gifItem.images.fixed_height_small.url}
                    alt={gifItem.title}
                    onClick={() => {
                      setGif(gifItem.images.fixed_height_small.url);
                      setGifResults([]);
                      setGifSearch('');
                    }}
                            style={{
                                cursor: 'pointer',
                                margin: '5px',
                                borderRadius: '6px',
                                border: gif === gifItem.images.fixed_height_small.url ? '3px solid blue' : 'none'
                            }}
                  />
                ))}
              </div>


              <input
                type="text"
                placeholder="GIF URL"
                value={gif}
                readOnly
                style={{ marginBottom: '10px' }}
              />


              <button
                onClick={() => {
                  handleAddCard();
                  setShowModal(false);
                }}
                disabled={!title || !description || !gif}
              >
                Add Card
              </button>
            </div>
          </div>
        )}


        <section className="cards-grid">
          {cards.map((card) => (
            <div className="card" key={card.id}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <img src={card.gif} alt={card.title} />
              <div className="card-buttons">
                <button onClick={() => handleLike(card.id)}>Like ({card.likes})</button>
                <button onClick={() => handleDelete(card.id)}>Delete</button>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ViewBoardDetails;
