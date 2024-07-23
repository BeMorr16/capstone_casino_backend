const { getBiggestWins, getUserLeaderboards } = require('../controllers/leaderboardControllers');
const { express } = require('../shared');
const router = express.Router();

// //send for which game in the body
router.get('/transaction', getBiggestWins);

// //specify whether amount of money or win loss ratio in body
router.get('/user/:record?', getUserLeaderboards)


module.exports = router;