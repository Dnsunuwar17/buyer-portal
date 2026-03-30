const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Fetches all properties with an is_favourited flag for the current user
router.get('/properties', (req, res) => {
  const userId = req.user.id;

  const properties = db.prepare(`
    SELECT
      p.*,
      CASE WHEN f.id IS NOT NULL THEN 1 ELSE 0 END as is_favourited
    FROM properties p
    LEFT JOIN favourites f
      ON f.property_id = p.id AND f.user_id = ?
    ORDER BY p.id
  `).all(userId);

  res.json(properties);
});

// Fetches user's favourites only
router.get('/', (req, res) => {
  const userId = req.user.id;

  const favourites = db.prepare(`
    SELECT p.*
    FROM properties p
    INNER JOIN favourites f ON f.property_id = p.id
    WHERE f.user_id = ?
    ORDER BY f.id DESC
  `).all(userId);

  res.json(favourites);
});

// ADD a favourite
router.post('/:propertyId', (req, res) => {
  const userId = req.user.id;
  const propertyId = parseInt(req.params.propertyId);

  const property = db.prepare('SELECT id FROM properties WHERE id = ?').get(propertyId);
  if (!property) {
    return res.status(404).json({ error: 'Property not found.' });
  }

  try {
    db.prepare(
      'INSERT INTO favourites (user_id, property_id) VALUES (?, ?)'
    ).run(userId, propertyId);
    res.json({ message: 'Added to favourites.' });
  } catch (err) {
    res.status(409).json({ error: 'Already in your favourites.' });
  }
});

// REMOVE a favourite
router.delete('/:propertyId', (req, res) => {
  const userId = req.user.id;
  const propertyId = parseInt(req.params.propertyId);

  try {
    const result = db.prepare(
      'DELETE FROM favourites WHERE user_id = ? AND property_id = ?'
    ).run(userId, propertyId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favourite not found.' });
    }

    res.json({ message: 'Removed from favourites.' });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Already in your favourites.' });
    }
    res.status(500).json({ error: 'Could not remove favourite.' });
  }
});

module.exports = router;