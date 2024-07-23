const { findUserWithToken } = require('../queries/userQueries');

async function isLoggedIn(req, res, next) {
    try {
        const header = req.headers.authorization;
        const token = header.split(' ')[1]
        req.user = await findUserWithToken(token);
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {isLoggedIn};