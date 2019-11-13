const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);


app.listen(3000, (err) => {
    if (err) {
        console.log('aconteceu um erro', err);
    } else {
        console.log('nodeAPI rodando na porta http://localhost:3000');
    }
});