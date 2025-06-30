import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const { Client } = pg;
const client = new Client({
  host: 'dpg-d0sde1idbo4c73evp1sg-a.oregon-postgres.render.com',
  port: '5432',
  user: 'twitter3005_user',
  password: 'Yx5XcPdSciWp8uVHlBpEAroHLAS5xlUs',
  database: 'twitter3005',
  ssl: true,
});

client
  .connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Connection error', err.stack));

app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/posts', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        posts.id,
        posts.name,
        posts.mail,
        posts.message,
        posts.imgmessage,
        posts.date,
        posts.quantityReposts,
        posts.quantityLike,
        posts.quantityShare,
        users.avatar_url
      FROM posts
      LEFT JOIN users ON posts.userid = users.id
      ORDER BY posts.date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении постов:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.post('/posts', async (req, res) => {
  const { token } = req.cookies;
  const { message, image } = req.body;
  console.log('ссылка на изображение:', image);

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const session = await client.query(
      `SELECT users.id, users.email FROM sessions 
       JOIN users ON sessions.user_id = users.id 
       WHERE sessions.token = $1 AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный или просроченный токен' });
    }

    const user = session.rows[0];

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Сообщение не должно быть пустым' });
    }

    const id = crypto.randomUUID();
    const date = new Date();

    const result = await client.query(
      `INSERT INTO posts (id, userId, name, mail, message, imgmessage, date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, user.id, user.email.split('@')[0], user.email, message, image || '', date],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при сохранении поста:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
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

app.get('/feed', async (req, res) => {
  const { token } = req.cookies;

  if (!token || !(await isValidToken(token))) {
    return res.status(401).send('Пользователь не авторизован');
  }

  return res.send('feed');
});

app.put('/settings/profile', async (req, res) => {
  const { token } = req.cookies;
  const {
    username,
    nickname,
    bio,
    geo,
    site,
    birthday,
    avatarUrl,
  } = req.body;

  if (!token) {
    res.status(401).json({ error: 'Необходима авторизация' });
    return;
  }

  try {
    const session = await client.query(`
      SELECT users.id FROM sessions
      JOIN users ON sessions.user_id = users.id
      WHERE sessions.token = $1 AND sessions.created_at > NOW() - INTERVAL '7 days'
    `, [token]);

    if (session.rows.length === 0) {
      res.status(401).json({ error: 'Сессия недействительна' });
      return;
    }

    const userId = session.rows[0].id;

    if (username) {
      const exists = await client.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId],
      );
      if (exists.rows.length > 0) {
        res.status(400).json({ error: 'Имя пользователя уже занято' });
        return;
      }
    }

    const updated = await client.query(`
      UPDATE users
      SET username = $1,
          nickname = $2,
          bio = $3,
          geo = $4,
          site = $5,
          birthday = $6,
          avatar_url = $7
      WHERE id = $8
      RETURNING id, email, username, nickname, bio, geo, site, birthday, avatar_url
    `, [
      username || null,
      nickname || null,
      bio || null,
      geo || null,
      site || null,
      birthday || null,
      avatarUrl || null,
      userId,
    ]);

    res.status(200).json(updated.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.put('/settings/password', async (req, res) => {
  const { token } = req.cookies;
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const session = await client.query(
      `SELECT users.id, users.password FROM sessions 
       JOIN users ON sessions.user_id = users.id 
       WHERE sessions.token = $1 AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Сессия не найдена или истекла' });
    }

    const user = session.rows[0];
    const match = await bcrypt.compare(oldPassword, user.password);

    if (!match) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await client.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashNewPassword, user.id],
    );

    return res.status(200).json({ message: 'Пароль успешно обновлён' });
  } catch (error) {
    console.error('Ошибка при смене пароля:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
