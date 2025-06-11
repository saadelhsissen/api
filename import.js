const fs = require('fs');
const db = require('./database');

// Charger les données depuis le fichier JSON
const data = JSON.parse(fs.readFileSync('./SuperHerosComplet.json', 'utf-8'));

// Préparer l'insertion dans la base
const insert = db.prepare(`
  INSERT INTO heroes (id, name, publisher, gender, race, power, alignment, height_cm, weight_kg, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Vérifier si la table est vide avant l'insertion
const count = db.prepare('SELECT COUNT(*) AS total FROM heroes').get();

if (count.total === 0) {
  const now = new Date().toISOString(); // Date de création (automatique)
  
  // Parcourir les super-héros dans le fichier JSON et insérer dans la base
  for (const hero of data.superheros) {
    // Extraire les informations nécessaires
    const { id, name, biography, appearance, powerstats } = hero;

    // Extraire le publisher, gender, race, alignment
    const publisher = biography ? biography.publisher : '';
    const alignment = biography ? biography.alignment : '';
    const gender = appearance ? appearance.gender : '';
    const race = appearance ? appearance.race : '';
    const power = powerstats ? powerstats.strength : ''; // Exemple pour prendre un stat de power

    // Extraire la taille (height) et le poids (weight) en prenant les valeurs numériques
    const height_cm = parseInt(appearance.height[1].replace(' cm', '').trim());  // Convertir en cm
    const weight_kg = parseInt(appearance.weight[1].replace(' kg', '').trim());  // Convertir en kg

    // Insérer les données dans la base
    insert.run(
      hero.id,
      hero.name,
      publisher,
      gender,
      race,
      power,
      alignment,
      height_cm,
      weight_kg,
      now
    );
  }

  console.log('✅ Données initiales importées.');
} else {
  console.log('ℹ️ Données déjà présentes, import ignoré.');
}