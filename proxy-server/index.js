import express from 'express';
import fetch from 'node-fetch';  // Eğer CommonJS ile kullanıyorsanız const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SHEET_ID = '1oCG5VsgXfzoroQ4XBEaRKW59rFignOGitzHd54ZmQDM';
const API_KEY = 'AIzaSyAlRi3jppUv129WcisjtA_t-aExDtVc7M4';

// Yeni ürün eklemek için endpoint
app.post('/api/addProduct', async (req, res) => {
  const { barcode, title, author, publisher, price, category } = req.body;
  
  const body = {
    range: "Sayfa1",
    majorDimension: "ROWS",
    values: [
      [barcode, title, author, publisher, price, category],
    ],
  };

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sayfa1:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error('API isteğinde bir sorun oluştu');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Ürün eklenirken bir hata oluştu:', error);
    res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy sunucu ${PORT} portunda çalışıyor`);
});
