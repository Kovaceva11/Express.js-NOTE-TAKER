const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json')
// Helper method for generating unique ids
const uuid = require('./public/helpers/uuid');
const PORT = process.env.PORT || 3001;

const app = express();



// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for notes.html page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET api/notes and return db.json
app.get('/api/notes', (req, res) => res.json(noteData));

// GET Route for wildcard page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text} = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };

      noteData.push(newNote);
      
      // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);