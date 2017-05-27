'use strict';

const database = require('../database');
const models = require('../models');

module.exports = {
    up: function (migration, Sequelize) {
        database.sync();
    },

    down: function (migration, Sequelize) {
        database.drop();
    }
};


