const express = require('express');
const app = express();
const cors = require('cors');
const port = 3050;
const cookieParser = require('cookie-parser');

const productRouter = require('./route/router');

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  }
));

app.use(express.json());
app.use(cookieParser('secret'));

app.use('/productfunc', productRouter);

app.listen(port, () => {
  console.log(`Listening at :${port}`);
});