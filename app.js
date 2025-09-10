import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const { Pool } = pg;
const pool = new Pool({
  host: 'dpg-d2rkp38gjchc73aoud90-a.oregon-postgres.render.com',
  port: '5432',
  user: 'twitter0209_user',
  password: 'QBVSEZOsncY9xLYNIwUBvrZ7kxDKx0Lr',
  database: 'twitter0209',
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// app.use(express.static('public'));

app.use(async (req, res, next) => {
  try {
    const client = await pool.connect();
    req.dbClient = client;

    res.on('finish', () => {
      if (req.dbClient) {
        req.dbClient.release();
        console.log('Connection released');
      }
    });

    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// client
//   .connect()
//   .then(() => console.log('Connected to database'))
//   .catch((err) => console.error('Connection error', err.stack));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

async function isValidToken(dbClient, token) {
  try {
    const result = await dbClient.query(
      "SELECT * FROM sessions WHERE token = $1 AND created_at > NOW() - INTERVAL '7 days'",
      [token],
    );
    return result.rowCount > 0;
  } catch (err) {
    console.error('Error checking token:', err);
    return false;
  }
}

app.get('/posts', async (req, res) => {
  try {
    const result = await req.dbClient.query(`
      SELECT 
        posts.id,
        posts.username,
        posts.email,
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
    const session = await req.dbClient.query(
      `SELECT users.id, users.email FROM sessions 
       JOIN users ON sessions.userid = users.id 
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

    const result = await req.dbClient.query(
      `INSERT INTO posts (id, userId, username, email, message, imgmessage, date) 
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
    const result = await req.dbClient.query('DELETE FROM posts WHERE id = $1', [
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
    username,
    email,
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
    const result = await req.dbClient.query(
      'UPDATE posts SET userId = $2, username = $3, email = $4, message = $5, imgMessage = $6, date = $7, quantityReposts = $8, quantityLike = $9,  quantityShare = $10 WHERE id = $1 RETURNING *',
      [
        postId,
        userId,
        username,
        email,
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
    const existUser = await req.dbClient.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (existUser.rows.length > 0) {
      return res.status(400).json({ error: 'user already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await req.dbClient.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id',
      [email, hashPassword],
    );
    console.log('user created', createUser.rows);
    await req.dbClient.query('INSERT INTO sessions (userid, token) VALUES ($1, $2) RETURNING *', [createUser.rows[0].id, token]);
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
    const result = await req.dbClient.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        await req.dbClient.query('INSERT INTO sessions (userid, token) VALUES ($1, $2) RETURNING *', [user.id, token]);
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
    const result = await req.dbClient.query(
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
    const session = await req.dbClient.query(`
      SELECT users.id FROM sessions
      JOIN users ON sessions.userid = users.id
      WHERE sessions.token = $1 AND sessions.created_at > NOW() - INTERVAL '7 days'
    `, [token]);

    if (session.rows.length === 0) {
      res.status(401).json({ error: 'Сессия недействительна' });
      return;
    }

    const userId = session.rows[0].id;

    if (username) {
      const exists = await req.dbClient.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId],
      );
      if (exists.rows.length > 0) {
        res.status(400).json({ error: 'Имя пользователя уже занято' });
        return;
      }
    }

    const updated = await req.dbClient.query(`
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
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const session = await req.dbClient.query(
      `SELECT users.id, users.password, users.last_password_change FROM sessions 
       JOIN users ON sessions.userid = users.id 
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
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Пароль слишком короткий' });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (samePassword) {
      return res.status(400).json({ error: 'Новый пароль должен отличаться от текущего' });
    }

    const now = new Date();
    const lastChange = new Date(user.last_password_change);
    const diffInHours = (now - lastChange) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return res.status(400).json({ error: 'Сменить пароль можно только раз в сутки' });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await req.dbClient.query(
      'UPDATE users SET password = $1, last_password_change = NOW()  WHERE id = $2',
      [hashNewPassword, user.id],
    );

    return res.status(200).json({ message: 'Пароль успешно обновлён' });
  } catch (error) {
    console.error('Ошибка при смене пароля:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.put('/settings/email', async (req, res) => {
  const { token } = req.cookies;
  const { newEmail, password } = req.body;

  if (!token || !newEmail || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  try {
    const session = await req.dbClient.query(`
      SELECT users.id, users.email, users.password FROM sessions
      JOIN users ON sessions.userid = users.id
      WHERE sessions.token = $1 AND sessions.created_at > NOW() - INTERVAL '7 days'
    `, [token]);

    if (session.rows.length === 0) {
      return res.status(401).json({ error: 'Сессия не найдена или истекла' });
    }

    const user = session.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    if (user.email === newEmail) {
      return res.status(400).json({ error: 'Email совпадает с текущим' });
    }

    const existing = await req.dbClient.query('SELECT id FROM users WHERE email = $1', [newEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    await req.dbClient.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, user.id]);
    res.cookie('email', newEmail, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ email: newEmail });
  } catch (err) {
    console.error('Ошибка при смене email:', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/me', async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const sessionResult = await req.dbClient.query(
      `SELECT users.id
       FROM sessions
       JOIN users ON sessions.userid = users.id
       WHERE sessions.token = $1
         AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный или просроченный токен' });
    }

    const userId = sessionResult.rows[0].id;

    const userResult = await req.dbClient.query(
      `SELECT id, email, avatar_url, username, nickname, bio, geo, site, birthday, last_password_change, background
       FROM users
       WHERE id = $1`,
      [userId],
    );

    const postsResult = await req.dbClient.query(
      `SELECT p.id, p.message, p.imgmessage, p.date,
              u.username, u.nickname, u.avatar_url
       FROM posts p
       JOIN users u ON p.userid = u.id
       WHERE p.userid = $1
       ORDER BY p.date DESC`,
      [userId],
    );

    return res.json({
      profile: userResult.rows[0],
      posts: postsResult.rows,
    });
  } catch (error) {
    console.error('Ошибка при получении профиля и постов:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/profile/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'Неверный ID пользователя' });
    }
    const userResult = await req.dbClient.query(
      'SELECT id, email, avatar_url, username, nickname, bio, geo, site, birthday, background FROM users WHERE id = $1',
      [userId],
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const postsResult = await req.dbClient.query(
      'SELECT id, message, imgmessage, date, quantityreposts, quantitylike, quantityshare FROM posts WHERE userid = $1 ORDER BY date DESC',
      [userId],
    );

    return res.json({
      profile: userResult.rows[0],
      posts: postsResult.rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
