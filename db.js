const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

//Crear tabla clientes
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        razon_social TEXT NOT NULL,
        rif TEXT NOT NULL,
        lastdigit INTEGER NOT NULL,
        condicion BOOLEAN NOT NULL)`
        );
});

module.exports = db;
