const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const port = 3000

const pool = new Pool({
  connectionString: 'postgres://localhost:5432/tictactoe',
  ssl: false
})

app.use(cors())
app.use(express.json())

app.post('/games', async (req, res) => {
    const { player, result } = req.body
    try {
        const query = 'INSERT INTO games (player, result) VALUES ($1, $2)'
        await pool.query(query, [player, result])
        res.status(201).send('Game result stored successfully')
    } catch (err) {
        console.error('Error storing game result:', err)
        res.status(500).send('Internal Server Error')
    }
})

app.get('/stats', async (req, res) => {
    try {
        const query = 'SELECT player, COUNT(*) AS count FROM games GROUP BY player'
        const { rows } = await pool.query(query)
        res.json(rows)
    } catch (err) {
        console.error('Error retrieving stats:', err)
        res.status(500).send('Internal Server Error')
    }
})

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})
