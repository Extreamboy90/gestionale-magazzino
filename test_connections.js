const mongoose = require('mongoose');

// Sostituisci <username>, <password> e myDatabase con i tuoi valori
mongoose.connect('mongodb+srv://extreamboy:Nala2024@cluster0.9sd9f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connessione a MongoDB riuscita!');
    })
    .catch(err => {
        console.error('Errore di connessione:', err);
    });
