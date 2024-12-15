const express = require('express');
const app = express();
const cors = require('cors');
const port = 3050;
const paymentfunc = require('./route/router');
const cookieParser = require('cookie-parser');

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  }
));

app.use(cookieParser('secret'));

app.use(express.json());

app.use('/payment', paymentfunc);

app.listen(port, () => {
  console.log(`Listening at :${port}`);
});