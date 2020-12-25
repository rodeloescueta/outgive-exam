const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');

router.use(cors());
router.use(bodyParser.json());


// ****************Previous code 
// Postgres client
// const { Pool } = require('pg');
// const pgClient = new Pool({
//   user: config.pgUser,
//   host: config.pgHost,
//   database: config.pgDatabase,
//   password: config.pgPassword,
//   port: config.pgPort,
// });
// pgClient.on('error', () => console.log('Lost Postgres connection'));

// TODO: Create initial DB table called task
// pgClient
//   .query(
//     `
//      // TODO: Inser create table SQL query here
//     `
//   )
//   .catch((err) => console.log(err));

// ****************Test to connect 
// const {Client} = require('pg')
// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'postgress_password',
//     port: 5432
// })

// client.connect()
// .then(() => console.log('ok na'))
// .catch((e) => console.log(e))
// .finally(() => {
//     console.log('finally')
//     client.end
// })


// Config

const config = require('../config');

const { Pool } = require('pg')

const pool = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort,
})

// TODO: Create initial DB table called task

// I'm not sure if it should really be 'task', I will used 'tasks'.

const createTasksTable = async () => {
  const text = `
    CREATE TABLE IF NOT EXISTS tasks (
    id uuid, 
    title TEXT NOT NULL, 
    details TEXT, 
    completed BOOLEAN DEFAULT false, 
    PRIMARY KEY (id))
  `
  const res = await pool.query(text)
  // await pool.end()
}

createTasksTable()

// Express route handlers

// Should be the only routes here('/').  But since there is no other versions, but v1. I will put all the routes here.

router.get('/', (req, res) => {
    res.send('Link to versions')
})

// Get all to do list tasks
router.get('/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
  const text = `SELECT * FROM tasks`
  const tasks = await pool.query(text)
  res.send(tasks.rows)
});

// Get a single todo task
router.get('/v1/task', async (req, res) => {
  // TODO: Insert your route logic here
  const text = `SELECT * FROM tasks WHERE id = $1`
  const values = [req.query.id]
  await pool.query(text, values)
  .then(item => {
    res.send(item.rows[0])
  })
  .catch(err => {
    console.log(err)
    res.send(err)
  })
  // res.send(item)
});

// Create a todo task
router.post('/v1/task', async (req, res) => {
  // TODO: Insert your route logic here
  const id = uuid()
  const text = `INSERT INTO tasks (id, title, details, completed) VALUES ($1, $2, $3, $4)`
  const values = [id, req.body.title, req.body.details, false]
  await pool.query(text, values)
  .then(() => {
    res.send(`Created task id: ${id}`)
  })
  .catch(err => {
    console.log(err)
    res.send('The request failed in adding a record due to an internal error.')
  })
});

// Update a todo task
router.put('/v1/task/:id', async (req, res) => {
  // TODO: Insert your route logic here
  const id = req.params.id
  const { title, details, completed} = req.body
  const text = `UPDATE tasks SET title = $1, details = $2, completed = $3 WHERE id = $4`
  const values = [title, details, completed, id]
  await pool.query(text, values)
  .then(() => {
      res.send(`Updated task id: ${id}`)
  })
  .catch(err => {
      console.log(err)
      res.send('The request failed in updating a record due to an internal error.')
  })
});

// Delete a todo task route
router.delete('/v1/task/:id', async (req, res) => {
  // TODO: Insert your route logic here
  const id = req.params.id
  const text = `DELETE FROM tasks WHERE id = $1`
  const values = [id]
  await pool.query(text, values)
  .then(() => {
      res.send(`Deleted task id: ${id}`)
  })
  .catch(err => {
      console.log(err)
      res.send('The request failed in deleting a record due to an internal error.')
  })
});


module.exports = router