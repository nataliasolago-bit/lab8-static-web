const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/lab8')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(e => console.error('Error Mongo:', e.message));

const Libro = mongoose.model('Libro', new mongoose.Schema({ titulo: String, autor: String }));

app.get('/api/libros', async (req, res) => res.json(await Libro.find()));
app.post('/api/libros', async (req, res) => res.status(201).json(await Libro.create(req.body)));
app.delete('/api/libros/:id', async (req, res) => { await Libro.findByIdAndDelete(req.params.id); res.sendStatus(204); });

app.listen(3000, () => console.log('Servidor en puerto 3000'));
