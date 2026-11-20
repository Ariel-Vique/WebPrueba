const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// 1. GET: Listar todos los equipos
app.get('/api/equipos', (req, res) => {
  const equipos = db.listar.all();
  res.json(equipos);
});

// 2. POST: Crear un nuevo equipo
app.post('/api/equipos', (req, res) => {
  const nombre = String(req.body.nombre || '').trim();
  const tipo = String(req.body.tipo || '').trim();

  // Validación básica en el servidor
  if (!nombre || !tipo) {
    return res.status(400).json({ error: 'El nombre y el tipo de equipo son obligatorios' });
  }

  const resultado = db.insertar.run(
    nombre, 
    tipo, 
    req.body.imagen || '', 
    req.body.especificaciones || ''
  );
  
  const nuevoEquipo = db.obtenerPorId.get(resultado.lastInsertRowid);
  res.status(201).json(nuevoEquipo);
});

// 3. DELETE: Borrar un equipo
app.delete('/api/equipos/:id', (req, res) => {
  const id = req.params.id;
  const resultado = db.borrar.run(id);

  if (resultado.changes === 0) {
    return res.status(404).json({ error: 'Equipo no encontrado' });
  }

  res.status(204).end();
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log('Servidor de equipos escuchando en http://localhost:' + PORT);
});