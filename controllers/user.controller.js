const db = require('../database');

// a) GET /heroes/:id
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id);
  if (!hero) return res.status(404).json({ message: 'Héros non trouvé' });
  res.json(hero);
};

// b) GET /heroes/search?q=bat
const searchUsers = (req, res) => {
  const q = req.query.q;
  const results = db.prepare('SELECT * FROM heroes WHERE name LIKE ?').all(`%${q}%`);
  res.json(results);
};

// c) GET /heroes?publisher=DC
const getUsers = (req, res) => {
  const publisher = req.query.publisher;
  if (publisher) {
    const filtered = db.prepare('SELECT * FROM heroes WHERE publisher = ?').all(publisher);
    return res.json({ message: 'Héros filtrés par éditeur', data: filtered });
  }

  const heroes = db.prepare('SELECT * FROM heroes').all();
  res.json({ message: 'Liste des utilisateurs', data: heroes });
};


// d) GET /heroes/sorted?by=height
const getSortedUsers = (req, res) => {
  const rawQuery = req.query.by;
  if (!rawQuery) {
    return res.status(400).json({ message: 'Paramètre ?by= requis' });
  }

  const allowed = ['height_cm', 'weight_kg', 'name', 'id', 'publisher'];
  const columns = rawQuery.split(',').map(col => col.trim());

  const invalid = columns.find(col => !allowed.includes(col));
  if (invalid) {
    return res.status(422).json({ message: `Tri non autorisé sur la colonne : ${invalid}` });
  }

  const sql = `SELECT * FROM heroes ORDER BY ${columns.join(', ')}`;
  const result = db.prepare(sql).all();

  res.json({
    message: `Héros triés par ${columns.join(', ')}`,
    data: result
  });
};


// e) POST /heroes
const addUser = (req, res) => {
  const {id,name,publisher} = req.body;

  //  Vérifie les champs obligatoires
  if (!id || !name || !publisher) {
    return res.status(400).json({
      message: 'Champs requis manquants : id, name et publisher sont obligatoires'
    });
  }

  const createdAt = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      INSERT INTO heroes (id, name, publisher, createdAt)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, name,publisher,createdAt);
    const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id);
    res.status(201).json(hero);

  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error: error.message });
  }
};



// f) DELETE /heroes/:id
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id);
  if (!hero) return res.status(404).json({ message: 'Héros non trouvé' });

  db.prepare('DELETE FROM heroes WHERE id = ?').run(id);
  res.json({ message: 'Héros supprimé', hero });
};

const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify');

const exportHeroesCSV = (req, res) => {
  let publisher = req.query.publisher;

  // Vérifie si un paramètre `publisher` est passé
  if (!publisher) {
    return res.status(400).json({ message: 'Paramètre publisher requis' });
  }

  // Nettoyer le publisher pour enlever les espaces ou les caractères encodés
  publisher = decodeURIComponent(publisher.replace(/\+/g, ' '));

  // Récupérer les héros correspondant à l'éditeur
  const rows = db.prepare('SELECT * FROM heroes WHERE publisher = ?').all(publisher);

  // Si aucun héros n'est trouvé
  if (rows.length === 0) {
    return res.status(404).json({ message: 'Aucun héros trouvé pour cet éditeur' });
  }

  // Utiliser `csv-stringify` pour générer le contenu CSV
  stringify(rows, { header: true }, (err, csv) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la génération du CSV', error: err.message });
    }

    // Définir les headers HTTP pour télécharger le fichier CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="export-${publisher}.csv"`);

    // Envoyer le CSV en réponse
    res.send(csv);
  });
};





const getStats = (req, res) => {
  const stats = db.prepare(`
    SELECT
      publisher,
      COUNT(*) AS total,
      ROUND(AVG(height_cm), 1) AS avg_height,
      ROUND(AVG(weight_kg), 1) AS avg_weight
    FROM heroes
    GROUP BY publisher
  `).all();

  res.json({
    message: 'Statistiques par éditeur',
    stats
  });
};

module.exports = {
  getUsers,
  addUser,
  getUserById,
  searchUsers,
  getSortedUsers,
  deleteUser,
  exportHeroesCSV,
  getStats
};


