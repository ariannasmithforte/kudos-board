const express = require('express');
const app = express();
const port = 8000 ;
const cors = require('cors')

app.use(express.json())
app.use(cors())

const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();



// GET home route
app.get('/', (req, res) => {
    res.send('Welcome to the Kudos API!');
  });

// GET all boards
app.get('/boards', async (req, res) => {
    try {
      const boards = await prisma.board.findMany({
        include: { cards: true },
      });
      res.json(boards);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error fetching boards' });
    }
  });

// GET a single board by ID
app.get('/boards/:id', async (req, res) => {
    const boardId = parseInt(req.params.id);
    try {
      const board = await prisma.board.findUnique({
        where: { id: boardId },
        include: { cards: true },
      });

      if (!board) {
        return res.status(404).json({ message: 'Board not found' });
      }

      res.json(board);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching board' });
    }
  });


 // GET all cards by board
app.get('/boards/:id/cards', async (req, res) => {
  const boardId = parseInt(req.params.id);
  try {
    const cards = await prisma.card.findMany({
      where: { boardId: boardId },
    });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cards for this board' });
  }
});


// GET a single card by ID
app.get('/cards/:id', async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching card' });
  }
});


// POST a new board

app.post('/boards', async (req, res) => {
  const { title, image, category, author } = req.body;
  try {
    const newBoard = await prisma.board.create({
      data: { title, image, category, author },
    });
    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: 'Error creating board' });
  }
});


// DELETE a board

app.delete('/boards/:id', async (req, res) => {
  const boardId = parseInt(req.params.id);
  try {
    // First delete all cards associated with the board
    await prisma.card.deleteMany({
      where: { boardId: boardId }
    });

    // Then delete the board
    await prisma.board.delete({ where: { id: boardId } });
    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ message: 'Error deleting board' });
  }
});


// POST a new card to a board
app.post('/boards/:id/cards', async (req, res) => {
  const boardId = parseInt(req.params.id);
  const { title, description, gif } = req.body;
  try {
    const newCard = await prisma.card.create({
      data: {
        title,
        description,
        gif,
        likes: 0,
        boardId,
      },
    });
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Error creating card' });
  }
});


// DELETE a card from a board
  app.delete('/cards/:id', async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    await prisma.card.delete({ where: { id: cardId } });
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting card' });
  }
});


// POST a like to a card
app.post('/cards/:id/like', async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: 'Error liking card' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Unique constraint violation.' });
    }
  }

  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ✅ Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
  });
}

// ✅ Export the app for Supertest
module.exports = app;

//route to serve the front end
