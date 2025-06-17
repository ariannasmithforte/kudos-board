import React from 'react';

// Function to render the header component
const Header = ({ searchTerm, setSearchTerm, handleSearch, handleClear, setFilter, onAddNewBoard}) => {
    // Array of filter options
    const filterOptions = ['All', 'Recent', 'Celebration', 'Thank You', 'Inspiration'];
    return (
        <header className="header-container">
            <h1> Kudos Board</h1>

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

            <nav className="filter-controls">
                {filterOptions.map((option) => (
                    <button key={option} onClick={() => setFilter(option)}>
                        {option}
                    </button>
                ))}
            </nav>

            <button onClick={onAddNewBoard}>Add Board</button>
        </header>
    );
};

export default Header;
