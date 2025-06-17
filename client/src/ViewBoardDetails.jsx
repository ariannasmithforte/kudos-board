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

    if (!board) {
        return <div>Board not found</div>;

    }
    // Function to add a new card to the board
    const handleAddCard = () => {
        const newCard = {
            id: cards.length + 1,
            title: title,
            description: description,
            gif: gif,
            likes: likes,
        };

        setCards((prev) => [...prev, newCard]);
        setTitle('');
        setDescription('');
        setGif('');
    };

    // Function handle likes
    const handleLike = (id) => {
        setCards((prev) =>
            prev.map((card) => {
                return card.id === id ? { ...card, likes: card.likes + 1 } : card;
            })
        );
    };

    // Function to handle delete
    const handleDelete = (id) => {
        setCards((prev) => prev.filter((card) => card.id !== id));
    };

    return (
        <>
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
                    placeholder='GIF'
                    value={gif}
                    onChange={(e) => setGif(e.target.value)}
                />
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
        </>

    );
};



export default ViewBoardDetails;
