import express from 'express';
import pg from 'pg';

const app = express()
const port = 3000

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const { Client } = pg;

const client = new Client({
  host: 'dpg-cstiij0gph6c739ekvhg-a',
  port: '5432',
  user: 'twitter_production_2eq4_user',
  password: 'ZMbsb1KZDvpXfDNdulXztYLYrPp2bRTK',
  database: 'twitter_production_2eq4'
});

client.connect()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Connection error', err.stack));
