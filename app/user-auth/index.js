const express = require('express');
const app = express();
const cors = require('cors');
const port = 3050;
const cookieParser = require('cookie-parser');

const userAuth = require('./route/userauth');

app.use(
  cors({
    origin: 'https://luxecloth.vercel.app',
    credentials: true, 
  })
);

app.options('*', cors());

app.use(express.json());
app.use(cookieParser('secret'));
app.use('/userauth', userAuth);

app.listen(port, () => {
  console.log(`Listening at :${port}`);
});