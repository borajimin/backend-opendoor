"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_NAME, 'postgres', process.env.DATABASE_PASSWORD, {
    dialect: 'postgres'
});

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

var House = sequelize.define('house', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    street: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.BIGINT
    },
    bedrooms: {
        type: Sequelize.INTEGER
    },
    bathrooms: {
        type: Sequelize.INTEGER
    },
    sq_ft: {
        type: Sequelize.BIGINT
    },
    lat: {
        type: Sequelize.FLOAT
    },
    lng: {
        type: Sequelize.FLOAT
    }
});


module.exports = {
    sequelize,
    House
};
