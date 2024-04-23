const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Create a PostgreSQL client
const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'acme_hr_directory',
    user: 'postgres',
    password: 'password'
});

// Connect to the database
client.connect();

app.use(bodyParser.json());
app.use(morgan('dev')); // Using Morgan for logging in 'dev' format



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});