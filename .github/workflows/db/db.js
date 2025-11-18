const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database', 'inmates.db');
const DB_KEY = "InmateDB@2025";

function openDb(){
  return new Promise((resolve, reject)=>{
    const db = new sqlite3.Database(DB_PATH, (err)=>{
      if(err) reject(err);
      db.run(`PRAGMA key = '${DB_KEY}';`, err=>{
        if(err) reject(err);
        resolve(db);
      });
    });
  });
}

async function init(){
  const folder = path.join(__dirname, '..', 'database');
  if(!fs.existsSync(folder)) fs.mkdirSync(folder);

  const db = await openDb();
  db.run(`
    CREATE TABLE IF NOT EXISTS inmates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT,
      prison_number TEXT,
      law_article TEXT
    );
  `);
  db.close();
}

async function allInmates(){
  const db = await openDb();
  return new Promise((resolve)=>{
    db.all("SELECT * FROM inmates", (err,rows)=>{
      db.close();
      resolve(rows);
    });
  });
}

async function addInmate(obj){
  const db = await openDb();
  return new Promise((resolve,reject)=>{
    db.run(
      "INSERT INTO inmates (full_name, prison_number, law_article) VALUES (?,?,?)",
      [obj.full_name, obj.prison_number, obj.law_article],
      function(err){
        db.close();
        if(err) reject(err);
        resolve(this.lastID);
      }
    );
  });
}

module.exports = {init, allInmates, addInmate};
