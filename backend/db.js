import path from 'path';
import sqlite3 from 'sqlite3'
//const path = require('path')
const dpPath = path.resolve('rules.db')
const db = new sqlite3.Database(dpPath, (err) => {
    if (err){
        console.log(err.message)
    }
    console.log("Connected to the SQLite database");
});

db.serialize(() =>{
    db.run('CREATE TABLE IF NOT EXISTS rules (id INTEGER PRIMARY KEY, rule TEXT, ast TEXT)');
});

export default db;