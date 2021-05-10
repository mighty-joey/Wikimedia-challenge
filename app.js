const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log('listening at port 3000'));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'wikimedia'
});

app.post('/donor', (request, response) => {
    console.log(request.body);

    const params = request.body;

    pool.getConnection((error, connection) => {
        if (error) {
            throw error;
        }

        connection.query(
            'INSERT INTO donations' +
            'preferredPayment, frequency, amount, comments ' +
            '(?, ?, ?, ?);' +

            'INSERT INTO donors ' +
            'lastName, firstName, streetAddress, city, state, country, postalCode, phoneNumber, email, preferredContact, donation ' +
            '(?, ?, ?, ?, ?, ?, ?, ?, ?, LAST_INSERT_ID() );',
            params,
            (error, rows) => {
                connection.release();

                if (!error) {
                    console.log('donor information inserted!');
                    response.sendStatus(201, 'Success!');
                } else {
                    console.log(error);
                    response.sendStatus(500);
                }
            });
    });

});