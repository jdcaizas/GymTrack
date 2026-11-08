// Muestra en la terminal lo que realmente se guarda en la BD: el hash, no la contraseña.
const Database = require('better-sqlite3');

const db = new Database('gymtrack.db', { readonly: true });
const rows = db.prepare('SELECT id, email, name, passwordHash FROM users').all();
console.table(rows);