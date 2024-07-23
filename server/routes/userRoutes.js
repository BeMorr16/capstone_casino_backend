const { express } = require('../shared');
const router = express.Router();
const { register, login, getUserInfo, editUser } = require('../controllers/userControllers');
const { isLoggedIn } = require('../middleware/authMiddleware')


router.post("/register", register);
router.post("/login", login);

router.get("/auth", isLoggedIn, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
});

router.get("/", isLoggedIn, getUserInfo)

router.put("/edit",isLoggedIn, editUser);


module.exports = router;