const { client, uuid } = require('../shared')


async function addTransactionQuery(reqBody) {
    const { id, game, win_loss, money, result, endTotal, miniGame, perfectGame, total_wins} = reqBody;
    let moneyDiff = money
    if (!money) {
        moneyDiff = 0;
    }
    let SQL = ` INSERT INTO transactions (transaction_id, user_id, game, win_loss, money, result)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`;
    let params = [uuid.v4(), id, game, win_loss, money, result];
    if (miniGame) {
        SQL = `INSERT INTO miniGame(id, user_id, game, endTotal, perfectGame, total_wins)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;`
        params = [uuid.v4(), id, game, endTotal, perfectGame, total_wins];
    }
    const response = await client.query(SQL, params);
    if (!response.rows.length) {
        const err = new Error('Transaction could not be added');
        err.status = 500;
        throw err;
    }
    return response.rows[0];
}

async function getFilteredHistoryQuery(id, win_loss) {
    const SQL = `
        SELECT * FROM transactions 
        WHERE user_id=$1 AND win_loss=$2;`;
    const response = await client.query(SQL, [id, win_loss]);
    return response;
}

async function getAllHistoryQuery(id) {
    const SQL = `SELECT * FROM transactions WHERE user_id = $1;`;
    const response = await client.query(SQL, [id]);
    return response;
}

async function getSingleCategoryHistoryQuery(game, id, win_loss = null) {
    let SQL;
    let params;
    if (win_loss !== null) {
        SQL = `
            SELECT * FROM transactions 
            WHERE user_id=$1 AND game=$2 AND win_loss=$3;`;
        params = [id, game, win_loss];
    } else {
        SQL = `
            SELECT * FROM transactions 
            WHERE user_id=$1 AND game=$2;`;
        params = [id, game];
    }
    const response = await client.query(SQL, params);
    return response;
}

module.exports = {
    addTransactionQuery,
    getFilteredHistoryQuery,
    getAllHistoryQuery,
    getSingleCategoryHistoryQuery,
}