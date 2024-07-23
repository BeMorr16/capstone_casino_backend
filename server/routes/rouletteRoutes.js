const { express } = require('../shared');
const router = express.Router();

router.get('/number', async (req, res) => {
    const min = 0;
    const max = 36;
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    res.status(200).json(number)
});

module.exports = router