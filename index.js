const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Altorum Kubernetes Test');
});

var port = process.env.PORT || 8002;

app.listen(port);
console.log(`Server is running at http://127.0.0.1:${port}`);

module.exports = app;
