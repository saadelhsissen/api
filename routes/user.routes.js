const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getUsers);                  // GET /heroes
router.get('/search', controller.searchUsers);         // GET /heroes/search
router.get('/sorted', controller.getSortedUsers);      // GET /heroes/sorted
router.get('/:id', controller.getUserById);            // GET /heroes/:id
router.post('/', controller.addUser);                  // POST /heroes
router.delete('/:id', controller.deleteUser);          // DELETE /heroes/:id
router.get('/heroes/export', controller.exportHeroesCSV);     // Export CSV
router.get('/stats', controller.getStats);             // Statistiques



module.exports = router;
