# API Superheroes

## Description

L'**API Superheroes** est une API RESTful développée en **Node.js** et utilisant une base de données **SQLite**. Elle permet de gérer une liste de super-héros avec des informations détaillées telles que le nom, l'éditeur, les pouvoirs, et les statistiques physiques. Cette API fournit des routes pour **ajouter, supprimer, rechercher, trier** et **exporter des données** au format CSV.

---

## Fonctionnalités

L'API permet d’effectuer plusieurs opérations sur les super-héros via les routes suivantes :

### Gestion des super-héros
- **Ajouter un super-héros** avec la route `POST /heroes`.
- **Supprimer un super-héros** par son `id` via la route `DELETE /heroes/:id`.
- **Consulter un super-héros** spécifique par son `id` avec `GET /heroes/:id`.

### Recherche et filtrage
- **Rechercher un super-héros** par son nom avec `GET /heroes/search?q=<nom>`.
- **Filtrer les super-héros par éditeur** avec `GET /heroes?publisher=<éditeur>`.

### Tri des données
- **Trier les super-héros** par un ou plusieurs critères (ex. `height_cm`, `weight_kg`, `name`) avec `GET /heroes/sorted?by=<criteria>`.

### Export des données
- **Exporter les super-héros** sous format CSV avec `GET /heroes/export?publisher=<éditeur>`.

### Statistiques
- **Obtenir des statistiques** sur les super-héros par éditeur avec `GET /heroes/stats`.

---

## Installation

### Prérequis
Avant d'exécuter l'API, assurez-vous que **Node.js** est installé sur votre machine. Si ce n'est pas déjà fait, vous pouvez le télécharger depuis [le site officiel de Node.js](https://nodejs.org/).

### Étapes d'installation
1. **Clonez le dépôt** ou téléchargez le code source sur votre machine.
2. **Installez les dépendances** via npm :
   ```bash
   npm install
