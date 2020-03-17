const pgp = require('pg-promise')();
const db = pgp({
    host: 'localhost',
    port: 5432,
    database: 'sample',
    user: 'postgres',
    password: 'postgres'
});

const getCars = (req, res) => 
    db.any('SELECT * FROM cars')
        .then(carListFromDb => res.send(carListFromDb))
        .catch(error => res.status(500).send(error))

const addCar = (req, res) => {
    const car = req.body;
    db.one(
        'INSERT INTO cars(make, model) VALUES($1, $2) RETURNING id',
        [car.make, car.model]
    ).then(result => {
        res.send({
            id: result.id,
            make: car.make,
            model: car.model,
        });
    }).catch(error => res.status(500).send(error))
}

const removeCar = (req, res) => {
    const id = req.params.id;
    db.result('DELETE FROM cars WHERE id = $1', [id])
        .then(result => {
            if(result.rowCount > 0) {
                res.send("OK");
            } else {
                res.status(404).send("Not Found!")
            }
        })
        .catch(error => res.status(500).send(error))
}

module.exports = {
    getCars,
    addCar,
    removeCar
};