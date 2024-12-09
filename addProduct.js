const mongoose = require('mongoose');
const Prodotto = require('./productModel');

mongoose.connect('mongodb+srv://extreamboy:Nala2024@cluster0.9sd9f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connesso a MongoDB');
        return aggiungiProdotto();
    })
    .catch(err => {
        console.error('Errore di connessione:', err);
    });

async function aggiungiProdotto() {
    try {
        const nuovoProdotto = new Prodotto({
            codice: 'P001',
            prodotto: 'Laptop',
            modello: 'X123',
            quantita: 10,
            scatola: 'Scatola A',
            data: Date,    
            scadenza: new Date('2025-12-31'),
            reparto: "Audio Video",
            linkFoto: 'https://esempio.com/foto-laptop'
        });

        const risultato = await nuovoProdotto.save();
        console.log('Prodotto aggiunto con successo:', risultato);
    } catch (err) {
        console.error('Errore durante l\'aggiunta del prodotto:', err);
    } finally {
        mongoose.disconnect();
    }
}
