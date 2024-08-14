const {
  getAllHistoryQuery,
  getSingleCategoryHistoryQuery,
  addTransactionQuery,
  getFilteredHistoryQuery,
  getPersonalMinigameStatsQuery,
} = require("../queries/transactionQueries");
const { editUserQuery } = require("../queries/userQueries");

async function addTransaction(req, res, next) {
  try {
    const transaction = await addTransactionQuery(req.body);
    const editedUser = await editUserQuery(req.body);
    res.status(201).json({ transaction, editedUser });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const { game, win_loss } = req.params;
    let history;
    if (game === "all") {
      if (win_loss !== undefined) {
        history = await getFilteredHistoryQuery(req.user.id, win_loss);
      } else {
        history = await getAllHistoryQuery(req.user.id);
      }
    } else {
      if (win_loss !== undefined) {
        history = await getSingleCategoryHistoryQuery(
          game,
          req.user.id,
          win_loss
        );
      } else {
        history = await getSingleCategoryHistoryQuery(game, req.user.id);
      }
    }
    res.status(200).json(history.rows);
  } catch (error) {
    next(error);
  }
}

async function getPersonalMinigameStats(req, res, next) {
  try {
    const list = await getPersonalMinigameStatsQuery(req);
    res.status(200).json(list.rows);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addTransaction,
  getHistory,
  getPersonalMinigameStats,
};
