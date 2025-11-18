const {app, BrowserWindow} = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dbModule = require('./db/db');

const api = express();
api.use(bodyParser.json());

api.get('/api/inmates', async (req,res)=>{
  const list = await dbModule.allInmates();
  res.json(list);
});

api.post('/api/inmates', async (req,res)=>{
  const id = await dbModule.addInmate(req.body);
  res.json({status:'ok', id});
});

let server;

function createWindow(){
  const win = new BrowserWindow({
    width: 1100,
    height: 760,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(async ()=>{
  await dbModule.init();
  server = api.listen(3000);
  createWindow();
});
