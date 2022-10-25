// SERVER-SIDE JS

const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const {v1:uuid} = require('uuid');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ROUTES to the files we need
app.use(express.json());
app.use(express.static(__dirname+'/public'));

// CRUD ROUTES
// Get items already in JSON 
app.get('/getItems',(req,res)=>{
  fs.readFile(__dirname+'/db.json', (err,data)=>{
    // console.log(JSON.parse(data).items);
    res.status(200).json(JSON.parse(data).items); // parsing the items in the json file
  })
})

// Add new tasks to JSON and give them a unique id from the uuid module that does it for you
app.post('/saveItem',(req,res)=>{
  fs.readFile(__dirname+'/db.json', (err,data)=>{
    const id = uuid();
    // console.log(id);

    const db = JSON.parse(data);
    req.body.id = id; // assigning the id from above
    db.items[db.items.length] = req.body;
    fs.writeFileSync(__dirname+'/db.json', JSON.stringify(db)); // writing the new JSON string to the file
    res.status(200).json({message:"New item Saved", id:id});
  })
})

// Delete items from task list and JSON
app.delete('/deleteItem/:id',(req,res)=>{
  fs.readFile(__dirname+'/db.json', (err,data)=>{
    const db = JSON.parse(data);
    db.items.forEach((item, index) => {
      if (item.id === req.params.id) {
        db.items.splice(index,1);
      }
    });
    fs.writeFileSync(__dirname+'/db.json', JSON.stringify(db));
    res.status(200).json({message:"task deleted"});
  })
})

// Update items (complete or incomplete)
app.post('/updateItem/:id',(req,res)=>{
  fs.readFile(__dirname+'/db.json', (err,data)=>{
    const db = JSON.parse(data);
    db.items.forEach(item => {
      if (item.id === req.params.id) {
        item[req.body.prop] = req.body.value;
      }
    });
    fs.writeFileSync(__dirname+'/db.json', JSON.stringify(db));
    res.status(200).json({message:"task updated"});
  })
});

// Setting up the server to listen on the port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});