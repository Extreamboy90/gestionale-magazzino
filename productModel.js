const mongoose = require('mongoose');

const prodottoSchema = new mongoose.Schema({
    codice: { type: String, required: true },
    prodotto: { type: String, required: true },
    modello: { type: String, required: true },
    quantita: { type: Number, required: true },
    scatola: { type: String, required: true },
    reparto:{ type: String, required: true },
    data:{ type: String, required: true },
    scadenza: String ,
    link: String,
})
module.exports = mongoose.model('Prodotto', prodottoSchema);
