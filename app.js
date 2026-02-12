import path from 'path';
import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const { Pool } = pg;

const pool = new Pool({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: '6543',
  user: 'postgres.zaccmholqsikvhvcfckw',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// app.use(express.static('public'));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



// app.use(async (req, res, next) => {
//   try {
//     const client = await pool.connect();
//     req.dbClient = client;

//     res.on('finish', () => {
//       if (req.dbClient) {
//         req.dbClient.release();
//         console.log('Connection released');
//       }
//     });

//     next();
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ error: 'Database connection failed' });
//   }
// });

// client
//   .connect()
//   .then(() => console.log('Connected to database'))
//   .catch((err) => console.error('Connection error', err.stack));

async function query(text, params) {
  return pool.query(text, params)
  }


  async function getCurrentUserId(req) {
    const { token } = req.cookies;
    if (!token) return null;
  
    try {
      const result = await query(
        `SELECT user_id
         FROM sessions
         WHERE token = $1
           AND created_at > NOW() - INTERVAL '7 days'
         LIMIT 1`,
        [token]
      );
  
      return result.rows.length ? result.rows[0].user_id : null;
    } catch (err) {
      console.error('getCurrentUserId error', err);
      return null;
    }
  }
  

app.get('/posts', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        posts.id,
        posts.username,
        posts.email,
        posts.message,
        posts.imgmessage,
        posts.date,
        posts.quantityreposts AS reposts_count,
        posts.quantitylike AS likes_count,
        posts.quantityshare AS share_count,
        users.avatar_url
      FROM posts
      LEFT JOIN users ON posts.user_id = users.id
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
  

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const session = await query(
      `SELECT users.id, users.email 
       FROM sessions 
       JOIN users ON sessions.user_id = users.id 
       WHERE sessions.token = $1 
         AND sessions.created_at > NOW() - INTERVAL '7 days'`,
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

    const result = await query(
      `INSERT INTO posts (user_id, username, email, message, imgmessage, date, avatar_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        user.id,
        user.email.split('@')[0],
        user.email,
        message,
        image || '',
        date,
        ''
      ],
    );

    const savedPost = result.rows[0];

    try {
      const hashtags = message.toLowerCase().match(/#[\p{L}\p{N}_]+/gu) || [];
      const tags = [...new Set(hashtags.map((t) => t.slice(1)))]; // без повторов и #

      for (const tag of tags) {
        // eslint-disable-next-line no-await-in-loop
        const insertTag = await query(
          `INSERT INTO hashtags (tag, created_at)
           VALUES ($1, NOW())
           ON CONFLICT (tag) DO NOTHING
           RETURNING id`,
          [tag],
        );

        let hashtagId;

        if (insertTag.rows.length > 0) {
          hashtagId = insertTag.rows[0].id;
        } else {
          // eslint-disable-next-line no-await-in-loop
          const existing = await query(
            'SELECT id FROM hashtags WHERE tag = $1',
            [tag],
          );
          hashtagId = existing.rows[0].id;
        }
        // eslint-disable-next-line no-await-in-loop
        await query(
          `INSERT INTO post_hashtags (post_id, hashtag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [id, hashtagId],
        );
      }
    } catch (errHashtag) {
      console.error('Ошибка при обработке хештегов:', errHashtag);
      return res.status(500).json({
        error: 'Ошибка при обработке хештегов',
        details: errHashtag.message,
      });
    }

    return res.status(201).json(savedPost);
  } catch (error) {
    console.error('Ошибка при сохранении поста:', error);

    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.delete('/posts/:id.json', async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await query('DELETE FROM posts WHERE id = $1', [
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
    user_id,
    username,
    email,
    message,
    imgmessage,
    date,
    quantityreposts,
    quantitylike,
    quantityshare,
  } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'content error' });
    }
    const result = await query(
      'UPDATE posts SET userId = $2, username = $3, email = $4, message = $5, imgMessage = $6, date = $7, quantityReposts = $8, quantityLike = $9,  quantityShare = $10 WHERE id = $1 RETURNING *',
      [
        postId,
        user_id,
        username,
        email,
        message,
        imgmessage,
        date,
        quantityreposts,
        quantitylike,
        quantityshare,
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
  const username = email;
  const token = crypto.randomUUID();
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  try {
    const existUser = await query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    if (existUser.rows.length > 0) {
      return res.status(400).json({ error: 'user already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const createUser = await query(
      'INSERT INTO users(email, password, username) VALUES($1, $2, $3) RETURNING id',
      [email, hashPassword, username],
    );
    
    await query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *', [createUser.rows[0].id, token]);
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
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        await query('INSERT INTO sessions (user_id, token) VALUES ($1, $2) RETURNING *', [user.id, token]);
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
    const result = await query(
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

// app.get('/feed', async (req, res) => {
//   const { token } = req.cookies;

//   if (!token || !(await isValidToken(token))) {
//     return res.status(401).send('Пользователь не авторизован');
//   }

//   return res.send('feed');
// });

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
    const session = await query(`
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
      const exists = await query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId],
      );
      if (exists.rows.length > 0) {
        res.status(400).json({ error: 'Имя пользователя уже занято' });
        return;
      }
    }

    const updated = await query(`
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
    const session = await query(
      `SELECT users.id, users.password, users.last_password_change FROM sessions 
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
    const lastChange = user.last_password_change ? new Date(user.last_password_change) : new Date(0);
    const diffInHours = (now - lastChange) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return res.status(400).json({ error: 'Сменить пароль можно только раз в сутки' });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);

    await query(
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
    const session = await query(`
      SELECT users.id, users.email, users.password FROM sessions
      JOIN users ON sessions.user_id = users.id
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

    const existing = await query('SELECT id FROM users WHERE email = $1', [newEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email уже используется' });
    }

    await query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, user.id]);
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
    const sessionResult = await query(
      `SELECT users.id
       FROM sessions
       JOIN users ON sessions.user_id = users.id
       WHERE sessions.token = $1
         AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Неверный или просроченный токен' });
    }

    const userId = sessionResult.rows[0].id;

    const userResult = await query(
      `SELECT id, email, avatar_url, username, nickname, bio, geo, site, birthday, last_password_change, background
       FROM users
       WHERE id = $1`,
      [userId],
    );

    const postsResult = await query(
      `SELECT p.id, p.message, p.imgmessage, p.date,
              u.username, u.nickname, u.avatar_url
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
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
    const userId = id;

    const userResult = await query(
      'SELECT id, email, avatar_url, username, nickname, bio, geo, site, birthday, background FROM users WHERE id = $1',
      [userId],
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const postsResult = await query(
      'SELECT id, message, imgmessage, date, quantityreposts, quantitylike, quantityshare FROM posts WHERE user_id = $1 ORDER BY date DESC',
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

// Получение списка пользователей, на которых подписан текущий пользователь
app.get('/subscriptions', async (req, res) => {
  try {
    const followerId = await getCurrentUserId(req);
    if (!followerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await query(
      `SELECT u.id, u.username, u.nickname, u.avatar_url
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       WHERE s.follower_id = $1`,
      [followerId],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('get subscriptions error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/subscriptions/:userId', async (req, res) => {
  const targetId = req.params.userId;

  try {
    const followerId = await getCurrentUserId(req);
    if (!followerId) return res.status(401).json({ error: 'Unauthorized' });
    if (followerId === targetId) return res.status(400).json({ error: 'Cannot subscribe to yourself' });

    // const id = crypto.randomUUID();
    const insert = await query(
      `INSERT INTO subscriptions (follower_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (follower_id, user_id) DO NOTHING
       RETURNING *`,
      [followerId, targetId],
    );

    const already = insert.rowCount === 0;
    return res.status(already ? 200 : 201).json({
      subscribed: true,
      already,
      userId: targetId,
    });
  } catch (err) {
    console.error('subscribe error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/subscriptions/:userId', async (req, res) => {
  try {
    const currentUserId = await getCurrentUserId(req);
    if (!currentUserId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }

    const { userId } = req.params;

    await query(
      `DELETE FROM subscriptions 
       WHERE follower_id = $1 AND user_id = $2`,
      [currentUserId, userId],
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('unsubscribe error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/followers', async (req, res) => {
  try {
    const currentUserId = await getCurrentUserId(req);
    if (!currentUserId) return res.status(401).json({ error: 'Пользователь не авторизован' });

    const q = `
      SELECT u.id, u.username, u.nickname, u.avatar_url, u.bio, s.created_at as subscribed_at
      FROM subscriptions s
      JOIN users u ON s.follower_id = u.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `;
    const result = await query(q, [currentUserId]);
    return res.json(result.rows);
  } catch (err) {
    console.error('followers list error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/profile/:id/following', async (req, res) => {
  try {
    const userId = req.params.id;

    const q = `
      SELECT u.id, u.username, u.nickname, u.avatar_url, u.bio, s.created_at as subscribed_at
      FROM subscriptions s
      JOIN users u ON s.user_id = u.id
      WHERE s.follower_id = $1
      ORDER BY s.created_at DESC
    `;
    const result = await query(q, [userId]);
    return res.json(result.rows);
  } catch (err) {
    console.error('profile following error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/profile/:id/followers', async (req, res) => {
  try {
    const userId = req.params.id;

    const q = `
      SELECT u.id, u.username, u.nickname, u.avatar_url, u.bio, s.created_at as subscribed_at
      FROM subscriptions s
      JOIN users u ON s.follower_id = u.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `;
    const result = await query(q, [userId]);
    return res.json(result.rows);
  } catch (err) {
    console.error('profile followers error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.delete('/subscriptions/remove-follower/:followerId', async (req, res) => {
  try {
    const currentUserId = await getCurrentUserId(req);
    if (!currentUserId) return res.status(401).json({ error: 'Пользователь не авторизован' });

    const { followerId } = req.params;

    const del = await query(
      'DELETE FROM subscriptions WHERE follower_id = $1 AND user_id = $2 RETURNING *',
      [followerId, currentUserId],
    );

    if (del.rowCount === 0) {
      return res.status(200).json({ removed: false });
    }
    return res.status(200).json({ removed: true, followerId });
  } catch (err) {
    console.error('remove follower error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/popular-users', async (req, res) => {
  try {
    const userId = await getCurrentUserId(req);
    if (!userId) return res.json([]); // ⭐ ВАЖНО

    const result = await query(`
      SELECT 
        u.id,
        u.username,
        u.nickname,
        u.avatar_url,
        COUNT(s.follower_id)::int AS followers_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      GROUP BY 
        u.id,
        u.username,
        u.nickname,
        u.avatar_url
      ORDER BY followers_count DESC
      LIMIT 3
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('popular users error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/feed', async (req, res) => {
  try {
    const currentUserId = await getCurrentUserId(req);
    if (!currentUserId) return res.status(401).json({ error: 'Пользователь не авторизован' });

    const result = await query(
      `SELECT 
         p.id,
         p.user_id,
         p.username,
         p.email,
         p.message,
         p.imgmessage,
         p.date,
         p.quantityreposts,
         p.quantitylike,
         p.quantityshare,
         u.avatar_url
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
          OR p.user_id IN (SELECT user_id FROM subscriptions WHERE follower_id = $1)
       ORDER BY p.date DESC
       LIMIT 200`,
      [currentUserId],
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('feed error', err);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/hashtag/:tag', async (req, res) => {
  const { tag } = req.params;

  try {
    const result = await query(`
      SELECT 
        p.id,
        p.message,
        p.imgmessage,
        p.date,
        u.username,
        u.nickname,
        u.avatar_url
      FROM post_hashtags ph
      JOIN hashtags h ON h.id = ph.hashtag_id
      JOIN posts p ON p.id = ph.post_id
      JOIN users u ON u.id = p.user_id
      WHERE h.tag = $1
      ORDER BY p.date DESC
    `, [tag.toLowerCase()]);

    return res.json(result.rows);
  } catch (error) {
    console.error('hashtag error:', error);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.get('/hashtags/popular', async (req, res) => {
  try {
    const userId = await getCurrentUserId(req);
    if (!userId) return res.json([]); // ⭐

    const result = await query(`
      SELECT h.tag, COUNT(ph.post_id)::int AS count
      FROM hashtags h
      JOIN post_hashtags ph ON ph.hashtag_id = h.id
      GROUP BY h.id, h.tag
      ORDER BY count DESC
      LIMIT 3
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('popular hashtags error:', error);
    res.status(500).json({ error: 'internal server error' });
  }
});

app.post('/like', async (req, res) => {
  const { token } = req.cookies;
  const { postId } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const session = await query(
      `SELECT users.id FROM sessions 
       JOIN users ON sessions.user_id = users.id
       WHERE sessions.token = $1
         AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (session.rows.length === 0) return res.status(401).json({ error: 'Неверный токен' });

    const userId = session.rows[0].id;

    await query(
      `INSERT INTO likes (user_id, post_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, post_id) DO NOTHING`,
      [userId, postId],
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('like error:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.delete('/like', async (req, res) => {
  const { token } = req.cookies;
  const { postId } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const session = await query(
      `SELECT users.id FROM sessions 
       JOIN users ON sessions.user_id = users.id
       WHERE sessions.token = $1
         AND sessions.created_at > NOW() - INTERVAL '7 days'`,
      [token],
    );

    if (session.rows.length === 0) return res.status(401).json({ error: 'Неверный токен' });

    const userId = session.rows[0].id;

    await query(
      'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId],
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('unlike error:', err);
    return res.status(500).json({ error: 'internal server error' });
  }
});

app.get('/posts/:postId/likes', async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await query(
      'SELECT COUNT(*) AS count FROM likes WHERE post_id = $1',
      [postId],
    );

    res.json({ count: Number(result.rows[0].count) });
  } catch (err) {
    console.error('likes count error:', err);
    res.status(500).json({ error: 'internal server error' });
  }
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
