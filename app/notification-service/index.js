const express = require('express');
const app = express();
const cors = require('cors');
const port = 3050;  

app.use(cors());

app.get('/notif', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Notification service listening at http://localhost:${port}`);
});

