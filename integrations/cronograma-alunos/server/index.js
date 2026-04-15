require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const aulaRoutes = require('./routes/aulas');
const turmaRoutes = require('./routes/turmas');
const professorRoutes = require('./routes/professores');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API primeiro
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/professores', professorRoutes);

// Frontend por último
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});