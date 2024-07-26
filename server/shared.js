const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const pg = require('pg');
require('dotenv').config();
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || "postgres://localhost/casino_capstone",
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    express,
    app,
    bcrypt,
    jwt,
    uuid,
    client
};