const express = require('express');
const cors = require('cors');
const { logger } = require('./middlewares');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api', routes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`база подключена ${PORT}`);
});