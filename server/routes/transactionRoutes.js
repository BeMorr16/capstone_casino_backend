const { getHistory, addTransaction } = require('../controllers/transactionControllers');
const { express } = require('../shared');
const router = express.Router();


router.post('/add', addTransaction);
router.get('/history/:game/:win_loss?', getHistory)


module.exports = router;