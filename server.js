require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const cors = require("cors");

const app = express();
const port =  5000;

// Middleware per gestire JSON
app.use(cors("http://localhost:4200/"));
app.use(express.json());
app.use('/api/products', productRoutes); 


// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('Connessione a MongoDB riuscita'))
.catch(err => console.error('Errore di connessione a MongoDB:', err));

// Rotta di esempio
app.get('/', (req, res) => {
  res.send('API Magazzino Attiva!');
});

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
