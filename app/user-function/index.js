const express = require('express');
const cors = require('cors');
const app = express();
const userFunction = require('./route/route');
const port = 3050;
const cookieParser = require('cookie-parser');

require('./db/serve');

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  }
));

app.use(express.json());
app.use(cookieParser());
app.use('/userfunc', userFunction);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Listening at :${port}`);
});