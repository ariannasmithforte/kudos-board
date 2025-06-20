import React from 'react';

// Function to render the dashboard page with a list of boards
const Dashboard = ({ boards, handleView, handleDelete }) => {

  return (
    <div className="dashboard-content">
      <section>
        {boards.map((board) => (
          <article key={board.id}>
            <img src={board.image} alt={`${board.title}`} />
            <h3>{board.title}</h3>
            <p>Author: {board.author}</p>
            <p>Category: {board.category}</p>
            <button onClick={() => handleView(board.id)}>View Board</button>
            <button onClick={() => handleDelete(board.id)}>Delete Board</button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
