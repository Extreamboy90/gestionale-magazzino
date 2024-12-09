const mongoose = require('mongoose');
const { stringify } = require('querystring');

// Funzione per generare il codice prodotto
async function generateProductCode(reparto) {
    // Estrai le prime due lettere maiuscole, se presenti
    const upperCaseLetters = reparto.match(/[A-Z]/g);
    let codiceReparto = '';

    if (upperCaseLetters && upperCaseLetters.length >= 2) {
      // Se ci sono due o più lettere maiuscole, prendi le prime due
      codiceReparto = upperCaseLetters.slice(0, 2).join('');
    } else {
      // Se c'è solo una lettera maiuscola, prendi le prime due lettere del nome del reparto
      codiceReparto = reparto.slice(0, 2).toUpperCase();
    }

    // Trova tutti i prodotti nel database per quel reparto e ordina per codice crescente
    const existingProducts = await Product.find({ codice: { $regex: `^${codiceReparto}` } })
                                          .sort({ codice: 1 }); // Ordinato per codice crescente

    // Verifica se ci sono codici mancanti (es. EL001, EL002, ma manca EL003)
    const usedCodes = existingProducts.map(product => product.codice);
    let nextCode = null;

    for (let i = 1; i <= existingProducts.length + 1; i++) {
        const codeToCheck = `${codiceReparto}${String(i).padStart(3, '0')}`;
        if (!usedCodes.includes(codeToCheck)) {
            nextCode = codeToCheck;
            break;
        }
    }

    // Se non ci sono codici "mancanti", genera il prossimo codice progressivo
    if (!nextCode) {
        const lastProduct = existingProducts.length > 0 ? existingProducts[existingProducts.length - 1] : null;
        const lastNumber = lastProduct ? parseInt(lastProduct.codice.slice(2), 10) : 0;
        nextCode = `${codiceReparto}${String(lastNumber + 1).padStart(3, '0')}`;
    }

    return nextCode;
}


// Definizione dello schema del prodotto
const productSchema = new mongoose.Schema({
  codice: {
    type: String,
    unique: true
  },
  prodotto: {
    type: String,
    required: true
  },
  modello: {
    type: String,
    required: true
  },
  quantita: {
    type: Number,
    required: true
  },
  scatola: {
    type: String
  },
  data:{
    type: String,
    default: Date
  },
  scadenza: {
    type: String
  },
  reparto:{
    type: String,
    required: true
  },
  link: {
    type: String
  }
});

productSchema.pre('save', async function(next) {
    if (this.isNew) {
      const codice = await generateProductCode(this.reparto);
      this.codice = codice; // Imposta il codice generato
    }
    next();
  });

  // Rimuovere _id e __v in ogni risposta JSON
productSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Elimina _id e __v dalla risposta JSON
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

  // Creazione del modello per il prodotto
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
