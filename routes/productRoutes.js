const express = require('express');
const Product = require('../models/Product'); // Importa il modello Product

const router = express.Router();

console.log('File productRoutes.js caricato');

// Rotta per aggiungere un prodotto
router.post('/add', async (req, res) => {
  try {
    const { codice, prodotto, modello, quantita, data, scatola, scadenza, reparto, link } = req.body;
     // Controlla se un prodotto con lo stesso codice esiste già nel database
    const existingProduct = await Product.findOne({ prodotto, modello, reparto });
    if (existingProduct) {
       // Se il prodotto esiste, restituisci un messaggio di errore
        return res.status(400).json({ status:"ERROR", data:  'Articolo già presente nel database!!' });
    }

    const newProduct = new Product({ codice, prodotto, modello, quantita, data, scatola, reparto, scadenza, link });
    await newProduct.save(); // Salva il prodotto nel database
    res.status(201).json({ message: 'Prodotto aggiunto con successo', product: newProduct });
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiungere il prodotto', error });
  }
});

// Rotta per ottenere tutti i prodotti
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Recupera tutti i prodotti dal database
    res.status(200).json({status:"SUCCESS", data: products});
  } catch (error) {
    res.status(500).json({status:"ERROR", data: 'Errore nel recuperare i prodotti', error });
  }
});

// Rotta per ottenere un prodotto specifico per codice
router.get('/:codice', async (req, res) => {
  try {
    const product = await Product.findOne({ codice: req.params.codice }); // Trova un prodotto per codice
    if (!product) {
      return res.status(404).json({ status:"ERROR", data: 'Prodotto non trovato' });
    }
    res.status(200).json({status: "SUCCESS", data: product});
  } catch (error) {
    res.status(500).json({ status:"ERROR", data:'Errore nel recuperare il prodotto', error });
  }
});

// Rotta per aggiornare un prodotto
router.put('/:codice', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { codice: req.params.codice },
      req.body,
      { new: true } // Restituisci il documento aggiornato
    );
    if (!updatedProduct) {
      return res.status(404).json({ Status: "ERROR", data:'Prodotto non trovato' });
    }
    res.status(200).json({ status:"SUCCESS", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ Status: "ERROR", data:'Errore nell\'aggiornare il prodotto' });
  }
});

// Rotta per eliminare un prodotto
router.delete('/:codice', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ codice: req.params.codice });
    if (!deletedProduct) {
      return res.status(404).json({status:"ERROR", data: 'Prodotto non trovato' });
    }
    res.status(200).json({status:"SUCCESS", data: 'Prodotto eliminato con successo' });
  } catch (error) {
    res.status(500).json({status:"ERROR", data: 'Errore nell\'eliminare il prodotto' });
  }
});

router.get('/filter', async (req, res) => {
  try {
      // Estrai i parametri di filtro dalla query string
      const { reparto, prodotto, modello, minQuantita, maxQuantita, scadenza } = req.query;
  
      // Log per vedere quali parametri sono stati ricevuti
      console.log('Parametri ricevuti:', req.query);
  
      // Crea un oggetto di filtro dinamico
      let filter = {};
  
      if (reparto) {
        filter.reparto = { $regex: reparto, $options: 'i' }; // Filtro per reparto (case-insensitive)
      }
  
      if (prodotto) {
        filter.prodotto = { $regex: prodotto, $options: 'i' }; // Filtro per nome (case-insensitive)
      }
  
      if (modello) {
        filter.modello = { $regex: modello, $options: 'i' }; // Filtro per modello (case-insensitive)
      }
  
      if (minQuantita) {
        filter.quantita = { $gte: parseInt(minQuantita) }; // Filtro per quantità minima
      }
  
      if (maxQuantita) {
        if (!filter.quantita) {
          filter.quantita = {};
        }
        filter.quantita.$lte = parseInt(maxQuantita); // Filtro per quantità massima
      }
  
      if (scadenza) {
        filter.scadenza = { $lte: new Date(scadenza) }; // Filtro per scadenza (prodotti che scadono prima della data)
      }
  
      // Log per vedere il filtro finale
      console.log('Filtro applicato:', filter);
  
      // Recupera i prodotti che corrispondono ai filtri
      const products = await Product.find(filter);
  
      // Log per verificare i prodotti trovati
      console.log('Prodotti trovati:', products);
  
      res.json(products);
    } catch (err) {
      console.error('Errore nel filtraggio dei prodotti:', err);
      res.status(500).send('Errore nel filtraggio dei prodotti');
    }
});
  
  

module.exports = router;
