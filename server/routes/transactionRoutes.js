const { getHistory, addTransaction, getPersonalMinigameStats } = require('../controllers/transactionControllers');
const { express } = require('../shared');
const { isLoggedIn } = require('../middleware/authMiddleware')
const router = express.Router();


router.post('/add', isLoggedIn, addTransaction);
router.get('/history/:game/:win_loss?', getHistory);
router.get('/minigame/history/:id', getPersonalMinigameStats);


module.exports = router;