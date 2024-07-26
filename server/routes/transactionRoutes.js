const { getHistory, addTransaction } = require('../controllers/transactionControllers');
const { editUser } = require('../controllers/userControllers');
const { express } = require('../shared');
const router = express.Router();


router.post('/add', addTransaction, editUser);
router.get('/history/:game/:win_loss?', getHistory)


module.exports = router;