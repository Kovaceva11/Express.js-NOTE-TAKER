// var express = require('express')
// var router = express.Router()

// // GET Route for retrieving all the notes
// router.get('/', (req, res) => {
//     console.info(`${req.method} request received for notes`);
//     readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
//   });
  
//   // POST Route for a new UX/UI note
//   router.post('/api/notes', (req, res) => {
//     console.info(`${req.method} request received to add a note`);
  
//     const { title, text } = req.body;
  
//     if (req.body) {
//       const newNote = {
//         title,
//         text,        
//         note_id: uuid(),
//       };
  
//       readAndAppend(newNote, './db/db.json');
//       res.json(`Tip added successfully 🚀`);
//     } else {
//       res.error('Error in adding note');
//     }
//   });

//   module.exports = router;