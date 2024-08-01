const {client} = require('../shared')


async function getBiggestWinsQuery() {
    try {
        const SQL = `
        SELECT t.*, u.username 
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE t.win_loss = true
        ORDER BY t.money DESC
        LIMIT 10;`;
        const leaderboard = await client.query(SQL);
        return leaderboard.rows;
    } catch (error) {
        const err = new Error('Error fetching biggest wins: ' + error.message);
        err.status = 500;
        throw err
    }
}

async function getMiniGameStatsQuery() {
    try {
        const SQL = `
        SELECT m.*, u.username
        FROM miniGame m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.endTotal DESC
        LIMIT 10;`
        const leaderboard = await client.query(SQL);
        return leaderboard.rows
    } catch (error) {
        const err = new Error('Error fetching miniGame Stats:', error.message)
        err.status = 500;
        throw err
    }
}
async function getPerfectMiniGamesQuery() {
    try {
        const SQL = `
        SELECT m.*, u.username
        FROM miniGame m
        JOIN users u ON m.user_id = u.id
        WHERE m.perfectGame = true;`
        const leaderboard = await client.query(SQL);
        return leaderboard.rows
    } catch (error) {
        const err = new Error('Error fetching miniGame Stats:', error)
        err.status = 500;
        throw err
    }
}


async function getBestRecordQuery() {
    const SQL = `
    SELECT username, wins, losses,
           (CASE WHEN wins + losses > 0 THEN 
               ROUND((wins * 100.0 / (wins + losses)), 2)
            ELSE 0
            END) AS win_percentage
    FROM users
    ORDER BY wins DESC
    LIMIT 5;`;
try {
    const leaderboard = await client.query(SQL);
    return leaderboard.rows;
} catch (error) {
    const err = new Error('Error fetching best records: ' + error.message);
    err.status = 500;
    throw err
}
}


async function getMostMoneyQuery() {
    try {
        const SQL = `
        SELECT username, user_money
        FROM users WHERE is_admin = false
        ORDER BY user_money DESC
        LIMIT 5;`;
        const leaderboard = await client.query(SQL);
        return leaderboard.rows;
    } catch (error) {
        const err = new Error('Error fetching most money leaders: ' + error.message);
        err.status = 500;
        throw err
    }
}


module.exports = {
    getBiggestWinsQuery,
    getMiniGameStatsQuery,
    getPerfectMiniGamesQuery,
    getBestRecordQuery,
    getMostMoneyQuery
}