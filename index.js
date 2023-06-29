const dotenv = require('dotenv');
dotenv.config();

/* Module */
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

/* Routes */
const main = require('./routes/main');

app.get('/', (req, res) => res.redirect(301, '/api'));
app.use('/api', main);
app.use('*', (req, res) => res.status(404).json({ success: false, error: 'Not Found' }));

app.listen(process.env.PORT || 3000, () => console.log('Server is running on PORT ' + process.env.PORT || 3000));