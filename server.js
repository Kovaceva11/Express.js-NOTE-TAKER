const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json')
// Helper method for generating unique ids
const uuid = require('./public/helpers/uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./public/helpers/fsUtils');
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
app.get('/api/notes/:note_id', (req, res) => res.json(noteData));

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
  
          // Write updated notes back to the file
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
// // new delete test
//   app.delete("/api/notes/:note_id", function(req, res) {
//     notes.splice(req.params.id, 1);
//     updateDb();
//     console.log("Deleted note with id "+req.params.id);
// });

//   // Delete request to add a note
// app.delete('/api/notes/:note_id', (req, res) => {
//   // Log that a Delete request was received
//   console.info(`${req.method} request received to delete a note`);

//   // Destructuring assignment for the items in req.body
//   const { title, text} = req.body;

//   // If all the required properties are present
//   if (title && text) {
//     // Variable for the object we will delete
//     const deletedNote = {
//       title,
//       text,
//       note_id: uuid(),
//     };

//     noteData.push(newNote);

//     // Obtain existing notes
//   fs.readFile('./db/db.json', 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         // Convert string into JSON object
//         const parsedNotes = JSON.parse(data);

//         // Add a new review
//         parsedNotes.push(newNote);

//         // Write updated notes back to the file
//         fs.writeFile(
//           './db/db.json',
//           JSON.stringify(parsedNotes, null, 4),
//           (writeErr) =>
//             writeErr
//               ? console.error(writeErr)
//               : console.info('Successfully updated notes!')
//         );
//       }
//     });
  
//     const response = {
//       status: 'success',
//       body: newNote,
//     };

//     console.log(response);
//     res.status(201).json(response);
//   } else {
//     res.status(500).json('Error in posting note');
//   }
// });


  // *****
  // This kinda works, but changes the db.json file into a string.
  app.delete('/api/notes/:id', function(req, res) {
    let jsonFilePath = path.join(__dirname, "./db/db.json");

    for (let i = 0; i < noteData.length; i++) {

        if (noteData[i].id == req.params.note_id) {
            noteData.splice(i, 1);
            break;
        }
    }    

    fs.writeFile(jsonFilePath, JSON.stringify(noteData, null, 2), function(err) {
        if (err) {
            return console.log(err);
        } else {
            console.log('Note was deleted');
        }
    })
    res.json(noteData);
})

// // This works. Kinda. Does not delete data from db.json.
//   app.delete('/api/notes/:id', (req, res) => {
//     const noteId = noteData.splice(req.params.id, 1);
//     // const noteId = req.params.note_id;
//     readAndAppend('./db/db.json')
//       .then((data) => JSON.parse(data))
//       .then((json) => {
//         // Make a new array of all tips except the one with the ID provided in the URL
//         const result = json.filter((note) => note.note_id !== noteId);

//         // Save that array to the filesystem
//         writeToFile(__dirname +'./db/db.json', result);

//         // Respond to the DELETE request
//         res.json(`Item ${noteId} has been deleted 🗑️`);
//       });
//   });

// // Another Attempt
// app.delete("/api/notes/:id", (req, res) => {
//   const chosenNoteToDelete = parseInt(req.params.note_id);
//   fs.readFile('./db/db.json', chosenNoteToDelete).then(function(data) {
//     const notes = [].concat(JSON.parse(data));
//     const newNotesArray = []
//     for (let i = 0; i <notes.length; i++) {
//       if (chosenNoteToDelete !== notes[i].id) {
//         newNotesArray.push(notes[i])
//       }
//     }
//     return newNotesArray
//   }).then(function(notes) {
//     writeFileSync('./db/db.json'. JSON.stringify(notes))
//     res.send('delete successful')
//   })  
// });

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);