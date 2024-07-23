const { getBiggestWinsQuery, getBestRecordQuery, getMostMoneyQuery } = require("../queries/leaderboardQueries");


async function getBiggestWins(req, res, next) {
    try {
        const leaderboard = await getBiggestWinsQuery()
        res.status(200).json(leaderboard)
    } catch (error) {
        next(error)
    }
}

async function getUserLeaderboards(req, res, next) {
    try {
        const { record } = req.params;
    if (record === 'record') {
        const leaderboard = await getBestRecordQuery();
        res.status(200).json(leaderboard)
    } else {
        const leaderboard = await getMostMoneyQuery();
        res.status(200).json(leaderboard)
    }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getBiggestWins,
    getUserLeaderboards
}