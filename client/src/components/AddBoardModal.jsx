import React, { useState } from 'react';

// Function component for the add board modal
const AddBoardModal = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

    // Create a new board object
    const newBoard = {
        id: Date.now(),
        title,
        category,
        author,
        createdAt: new Date(),
        image: 'https://picsum.photos/200/300',
    };
    onCreate(newBoard);
    onClose();
}

    return (
            <article className="modal-overlay">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <label>
                            Title:
                            <input type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Category:
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select a category:</option>
                                <option value="Celebration">Celebration</option>
                                <option value="Thank you">Thank you</option>
                                <option value="Inspiration">Inspiration</option>
                            </select>
                        </label>

                        <label>
                            Author:
                            <input type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </label>

                        <button type="submit">Create Board</button>
                        <button onClick={onClose}>Cancel</button>
                    </form>
                </div>
            </article>

    );
};

export default AddBoardModal;
