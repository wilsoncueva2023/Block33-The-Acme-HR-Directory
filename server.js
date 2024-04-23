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

app.get('/api/employees', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/departments', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM departments');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/employees', async (req, res) => {
    try {
        const { name, department_id } = req.body;
        const result = await client.query(
            'INSERT INTO employees (name, department_id) VALUES ($1, $2) RETURNING *',
            [name, department_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await client.query('DELETE FROM employees WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department_id } = req.body;
        const result = await client.query(
            'UPDATE employees SET name = $1, department_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [name, department_id, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!' });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
