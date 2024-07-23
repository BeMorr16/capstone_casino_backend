const { getAllHistoryQuery, getSingleCategoryHistoryQuery, addTransactionQuery, getFilteredHistoryQuery } = require("../queries/transactionQueries");

async function addTransaction(req, res, next) {
    try {
        const transaction = await addTransactionQuery(req.body);
        res.status(201).json(transaction)
    } catch (error) {
        next(error)
    }
}

async function getHistory(req, res, next) {
    try {
        const { game, win_loss } = req.params;
        let history;
        if (game === 'all') {
            if (win_loss !== undefined) {
                history = await getFilteredHistoryQuery(req.user.id, win_loss);
            } else {
                history = await getAllHistoryQuery(req.user.id);
            }
        } else {
            if (win_loss !== undefined) {
                history = await getSingleCategoryHistoryQuery(game, req.user.id, win_loss);
            } else {
                history = await getSingleCategoryHistoryQuery(game, req.user.id);
            }
        }
        res.status(200).json(history.rows);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addTransaction,
    getHistory
}