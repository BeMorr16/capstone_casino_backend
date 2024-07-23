const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/casino_capstone");

module.exports = {
    express,
    app,
    bcrypt,
    jwt,
    uuid,
    client
};