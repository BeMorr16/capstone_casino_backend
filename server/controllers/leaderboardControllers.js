const { getBiggestWinsQuery, getBestRecordQuery, getMostMoneyQuery, getMiniGameStatsQuery, getPerfectMiniGamesQuery } = require("../queries/leaderboardQueries");


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

async function getMiniGameStats(req, res, next) {
    try {
        const { perfect } = req.params;
        if (perfect === 'perfect') {
            const leaderboard = await getPerfectMiniGamesQuery();
            res.status(200).json(leaderboard)
        } else {
            const leaderboard = await getMiniGameStatsQuery();
            res.status(200).json(leaderboard)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getBiggestWins,
    getUserLeaderboards,
    getMiniGameStats
}