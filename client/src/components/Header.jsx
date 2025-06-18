import React from 'react';

// Function to render the header component
const Header = () => {
    return (
        <header className="header-container">
            <h1>Kudos Board</h1>
        </header>
    );
};

// Sidebar component for search and filters
export const Sidebar = ({ searchTerm, setSearchTerm, handleSearch, handleClear, setFilter, onAddNewBoard }) => {
    const filterOptions = ['All', 'Recent', 'Celebration', 'Thank You', 'Inspiration'];

    return (
        <aside className="sidebar">
            <h3>Search</h3>
            <section className="search-bar">
                <input
                    type="text"
                    placeholder='Search boards...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClear}>Clear</button>
            </section>

            <h3>Filters</h3>
            <nav className="filter-controls">
                {filterOptions.map((option) => (
                    <button key={option} onClick={() => setFilter(option)}>
                        {option}
                    </button>
                ))}
            </nav>

            <button className="add-board-btn" onClick={onAddNewBoard}>
                Add New Board
            </button>
        </aside>
    );
};

export default Header;
