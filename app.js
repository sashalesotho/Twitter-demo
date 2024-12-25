import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;
const { Client } = pg;
const client = new Client({
  host: 'dpg-ctioc65umphs73f53m8g-a.oregon-postgres.render.com',
  port: '5432',
  user: 'twitter_ir0y_user',
  password: '9VZPoHIPiTD43gEabUJMJn9wt8oL0ElL',
  database: 'twitter_ir0y',
  ssl: true,
});

client.connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Connection error', err.stack));

app.use(express.static('public'));

app.get('/posts', async (req, res) => {
  try {
    const query = await client.query('SELECT * FROM posts');
    return res.json(query.rows);
  } catch (error) {
    console.error('error select', error);
    return res.status(500).send('server error');
  }
});

app.post('/posts', async (req, res) => {
  try {
    const {
      id,
      userId,
      name,
      mail,
      message,
      imgMessage,
      date,
      quantityReposts,
      quantityLike,
      quantityShare,
    } = req.body;

    if (!req.body) {
      return res.status(400).json({
        error: 'message is empty',
      });
    }

    const result = await client.query(`INSERT INTO posts (id,
    userId,
    name,
    mail,
    message,
    imgMessage,
    date,
    quantityReposts,
    quantityLike,
    quantityShare) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [id,
      userId,
      name,
      mail,
      message,
      imgMessage,
      date,
      quantityReposts,
      quantityLike,
      quantityShare]);
    const newPost = result.rows[0];

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('error insert', error);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.delete('/posts/:id.json', async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await client.query('DELETE FROM posts WHERE id = $1', [postId]);
    if (result.rowCount === 0) {
      return res.status(404).send('post not found');
    }
    return res.status(204).send();
  } catch (error) {
    console.error('error delete:', error);
    return res.status(500).send('internal server error');
  }
});

app.put('/posts/:id.json', async (req, res) => {
  const postId = req.params.id;
  const {
    userId,
    name,
    mail,
    message,
    imgMessage,
    date,
    quantityReposts,
    quantityLike,
    quantityShare,
  } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'content error' });
    }
    const result = await client.query('UPDATE posts SET userId = $2, name = $3, mail = $4, message = $5, imgMessage = $6, date = $7, quantityReposts = $8, quantityLike = $9,  quantityShare = $10 WHERE id = $1 RETURNING *', [postId,
      userId,
      name,
      mail,
      message,
      imgMessage,
      date,
      quantityReposts,
      quantityLike,
      quantityShare]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'post not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('error update', error);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
