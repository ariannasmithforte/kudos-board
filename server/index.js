const express = require('express');
const app = express();
const port = 8000 ;
app.use(express.json())

const { PrismaClient } = require('@prisma/client');
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


  // POST a new board
  app.post('/boards', async (req, res) => {
    const { title, image, category } = req.body;

    try {
      const newBoard = await prisma.board.create({
        data: {
          title,
          image,
          category,
        },
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
      await prisma.board.delete({
        where: { id: boardId },
      });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Error deleting board' });
    }
  });

  // GET all cards
  app.get('/cards', async (req, res) => {
    try {
      const cards = await prisma.card.findMany();
      res.json(cards);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching cards' });
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


  // POST a new card to a board
  app.post('/boards/:id/cards', async (req, res) => {
    const boardId = parseInt(req.params.id);
    const { title, description, gif, likes } = req.body;

    try {
      const newCard = await prisma.card.create({
        data: {
          title,
          description,
          gif,
          likes: likes || 0,
          boardId,
        },
      });
      res.status(201).json(newCard);
    } catch (err) {
      res.status(500).json({ message: 'Error adding card to board' });
    }
  });


  // DELETE a card from a board
  app.delete('/boards/:boardId/cards/:cardId', async (req, res) => {
    const cardId = parseInt(req.params.cardId);

    try {
      await prisma.card.delete({
        where: { id: cardId },
      });
      res.status(204).send();
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
            increment: 1, // 👈 Add 1 like
          },
        },
      });

      res.json(updatedCard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error liking card' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
