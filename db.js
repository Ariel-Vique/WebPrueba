const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('equipos.db'); // Archivo de base de datos para equipos

// Crear la tabla de equipos si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS equipos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    imagen TEXT,
    especificaciones TEXT
  )
`);

// Consultas preparadas actualizadas para equipos
const consultas = {
  listar: db.prepare('SELECT * FROM equipos'),
  obtenerPorId: db.prepare('SELECT * FROM equipos WHERE id = ?'),
  insertar: db.prepare('INSERT INTO equipos (nombre, tipo, imagen, especificaciones) VALUES (?, ?, ?, ?)'),
  actualizar: db.prepare('UPDATE equipos SET nombre = ?, tipo = ?, imagen = ?, especificaciones = ? WHERE id = ?'),
  borrar: db.prepare('DELETE FROM equipos WHERE id = ?')
};


module.exports = consultas;