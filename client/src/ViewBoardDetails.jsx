import React, { useState } from 'react';
// React router to switch between pages
import { useParams, useNavigate } from 'react-router-dom';

// Function to view the board details.
const ViewBoardDetails = ({boards}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const board = boards.find(board => board.id === Number(id));

    // Functions to set card details such as title, description, and GIF
    const [cards, setCards] = useState(board?.cards ||[]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [gif, setGif] = useState('');
    const [gifSearch, setGifSearch] = useState('');
    const [gifResults, setGifResults] = useState([]);

    if (!board) {
        return <div>Board not found</div>;
    }
    // Function to add a new card to the board
    const handleAddCard = () => {
        if (!title || !description || !gif) {
            alert('Please fill in all fields');
            return;
        }

        const newCard = {
            id: cards.length + 1,
            title: title,
            description: description,
            gif: gif,
            likes: 0,
        };

        setCards((prev) => [...prev, newCard]);
        setTitle('');
        setDescription('');
        setGif('');
    };

    // Function handle likes
    const handleLike = (id) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, likes: card.likes + 1 } : card
            )
        );
    };

    // Function to handle delete
    const handleDelete = (id) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    // Function to handle GIF search and API call
    const handleGifSearch = async () => {
        const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${gifSearch}&limit=6&offset=0&rating=G&lang=en`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setGifResults(data.data);
        } catch (error) {
            console.error("Error fetching GIFs", error);
        }
    };

    // Function to handle copying the GIF URL to the clipboard
    const handleCopyGif = async () => {
        try {
            await navigator.clipboard.writeText(gif);
            alert("GIF URL copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy GIF URL", err);
        }
    };

    return (
        <div className='board-deatil'>
            <h2>{board.title}</h2>
            <button onClick={() => navigate(-1)}>Back</button>

            <section className='add-card-form'>
                <h3>Add a Card</h3>
                <input
                    type="text"
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder='Search for a GIF...'
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                />
                <button onClick={handleGifSearch}>Search</button>

                <div className='gif-results'>
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
                />
                <button onClick={handleCopyGif}>Copy GIF URL</button>
                <button onClick={handleAddCard}>Add Card</button>
            </section>

            <section className='cards-grid'>
                {cards.map((card) => (
                    <div className='card' key={card.id}>
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                        <img src={card.gif} alt={card.title} />
                        <div className='card-buttons'>
                            <button onClick={() => handleLike(card.id)}>Like ({card.likes})</button>
                            <button onClick={() => handleDelete(card.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ViewBoardDetails;
