const { client, uuid } = require('../shared')


async function addTransactionQuery(reqBody) {
    try {
        const { id, game, win_loss, money, result, endTotal, miniGame, perfectGame, total_wins} = reqBody;
        let moneyDiff = money || 0;
        let SQL, params;

        if (miniGame) {
            SQL = `INSERT INTO miniGame(id, user_id, game, endTotal, perfectGame, total_wins)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`
            params = [uuid.v4(), id, game, endTotal, perfectGame, total_wins];
        } else {
            SQL = ` INSERT INTO transactions (transaction_id, user_id, game, win_loss, money, result)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;`;
            params = [uuid.v4(), id, game, win_loss, money, result];
        }
        const response = await client.query(SQL, params);
        if (!response.rows.length) {
            const err = new Error('Transaction could not be added');
            err.status = 500;
            throw err;
        }
        return response.rows[0];
    } catch (error) {
        throw new Error(`Error adding transaction: ${error.message}`);
    }
}

async function getFilteredHistoryQuery(id, win_loss) {
    try {
        const SQL = `SELECT * FROM transactions WHERE user_id=$1 AND win_loss=$2;`;
        const response = await client.query(SQL, [id, win_loss]);
        return response;
      } catch (error) {
        throw new Error(`Error getting filtered history: ${error.message}`);
      }
}

async function getAllHistoryQuery(id) {
    try {
        const SQL = `SELECT * FROM transactions WHERE user_id = $1;`;
        const response = await client.query(SQL, [id]);
        return response;
      } catch (error) {
        throw new Error(`Error getting all history: ${error.message}`);
      }
}

async function getSingleCategoryHistoryQuery(game, id, win_loss = null) {
    try {
        let SQL, params;
    
        if (win_loss !== null) {
          SQL = `SELECT * FROM transactions WHERE user_id=$1 AND game=$2 AND win_loss=$3;`;
          params = [id, game, win_loss];
        } else {
          SQL = `SELECT * FROM transactions WHERE user_id=$1 AND game=$2;`;
          params = [id, game];
        }
    
        const response = await client.query(SQL, params);
        return response;
      } catch (error) {
        throw new Error(`Error getting single category history: ${error.message}`);
      }
}

async function getPersonalMinigameStatsQuery(req) {
    try {
        const { id } = req.params;
        const SQL = `SELECT * FROM miniGame WHERE user_id = $1;`;
        const response = await client.query(SQL, [id]);
        return response;
      } catch (error) {
        throw new Error(`Error getting personal minigame stats: ${error.message}`);
      }
};

module.exports = {
    addTransactionQuery,
    getFilteredHistoryQuery,
    getAllHistoryQuery,
    getSingleCategoryHistoryQuery,
    getPersonalMinigameStatsQuery
}