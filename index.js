const express = require('express');
const db = require('./database');
const heroRoutes = require('./routes/user.routes');

const app = express();
app.use(express.json());

app.use('/heroes', heroRoutes); // ex: GET /heroes

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

