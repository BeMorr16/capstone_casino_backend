const { app, express, client } = require('./shared');
const { isLoggedIn } = require('./middleware/authMiddleware')
const cors = require('cors');


app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const rouletteRoutes = require('./routes/rouletteRoutes')


app.use("/user", userRoutes);
app.use("/transaction", isLoggedIn, transactionRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/roulette", rouletteRoutes);

app.use((err, req, res, next)=> {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
});
  
async function init() {
    const PORT = process.env.PORT || 8080;
    try {
        await client.connect();
        console.log("connected to DB")
        app.listen(PORT, () => {
            console.log(`Listening on Port ${PORT}...`)
        });
    } catch (error) {
        console.error("Error initializing server:", error);
        process.exit(1);
    }
}
init();