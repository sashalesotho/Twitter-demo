import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;
const { Client } = pg;
const client = new Client({
  host: 'dpg-curr31vnoe9s73d8fstg-a.oregon-postgres.render.com',
  port: '5432',
  user: 'twitter_demo_2102_user',
  password: 'uF04ciERWnVej7FB8jXWWxMbEUuEazFp',
  database: 'twitter_demo_2102',
  ssl: true,
});

client
  .connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Connection error', err.stack));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

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
  console.log(req.body);
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

    const result = await client.query(
      `INSERT INTO posts (id,
    userId,
    name,
    mail,
    message,
    imgMessage,
    date,
    quantityReposts,
    quantityLike,
    quantityShare) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
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
      ],
    );
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
    const result = await client.query('DELETE FROM posts WHERE id = $1', [
      postId,
    ]);
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
    const result = await client.query(
      'UPDATE posts SET userId = $2, name = $3, mail = $4, message = $5, imgMessage = $6, date = $7, quantityReposts = $8, quantityLike = $9,  quantityShare = $10 WHERE id = $1 RETURNING *',
      [
        postId,
        userId,
        name,
        mail,
        message,
        imgMessage,
        date,
        quantityReposts,
        quantityLike,
        quantityShare,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'post not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('error update', error);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.post('/createUser', async (req, res) => {
  const { email, password } = req.body;
  const token = crypto.randomUUID();
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  try {
    const existUser = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (existUser.rows.length > 0) {
      return res.status(400).json({ error: 'user already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await client.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id',
      [email, hashPassword],
    );
    console.log('user created', createUser.rows);
    await client.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *', [createUser.rows[0].id, token]);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('email', email, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ message: 'user created successfully' });
  } catch (error) {
    console.error('error during user creation:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const token = crypto.randomUUID();
  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        await client.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *', [user.id, token]);
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.cookie('email', email, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ text: 'login successful' });
      }
      return res.status(400).json({ error: 'invalid password' });
    }
    return res.status(400).json({ error: 'user not found' });
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.get('/protected-route', async (req, res) => {
  const { token } = req.cookies;
  const { email } = req.cookies;

  if (!token || !email) {
    return res.status(401).send('authorization required');
  }

  try {
    const result = await client.query(
      "SELECT * FROM sessions WHERE token = $1 AND created_at > NOW() - INTERVAL '7 days'",
      [token],
    );

    if (result.rowCount === 0) {
      return res.status(401).send('invalid or expired token');
    }

    return res.status(200).send('ok');
  } catch (err) {
    return res.status(500).send('token verification error');
  }
});

async function isValidToken(token) {
  try {
    const result = await client.query(
      "SELECT * FROM sessions WHERE token = $1 AND created_at > NOW() - INTERVAL '7 days'",
      [token],
    );

    return result.rowCount > 0;
  } catch (err) {
    console.error('error checking token:', err);
    return false;
  }
}

// app.get('/feed', async (req, res) => {
//   const { token } = req.cookies;

//   if (!token || !(await isValidToken(token))) {
//     return res.status(401).send('<script>alert("Пользователь не авторизован"); window.location.href = "/";</script>');
//   }

//   return res.send('feed');
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
