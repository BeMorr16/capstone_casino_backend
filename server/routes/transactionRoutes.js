const { getHistory, addTransaction } = require('../controllers/transactionControllers');
const { editUser } = require('../controllers/userControllers');
const { express } = require('../shared');
const { isLoggedIn } = require('../middleware/authMiddleware')
const router = express.Router();


router.post('/add', isLoggedIn, addTransaction);
router.get('/history/:game/:win_loss?', getHistory)


module.exports = router;