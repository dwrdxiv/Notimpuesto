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

    db.run(`CREATE TABLE IF NOT EXISTS declaraciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        periodo TEXT, --Ejemplo: '2024/01/01' AÑO/MES/QUINCENA (1Q, 2Q, O 3M SI ES ORDINARIO)
        estatus TEXT DEFAULT 'pendiente', -- 'pendiente', 'declarado', 'pagado'
        FOREIGN KEY(cliente_id) REFERENCES clientes(id)
    )`)
});

module.exports = db;
