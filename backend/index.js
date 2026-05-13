const express = require('express');
const cors = require('cors');
const tableRoutes = require('./routes.js');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.use('/api', tableRoutes); 

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});