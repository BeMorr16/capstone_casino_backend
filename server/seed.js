const { client, uuid, bcrypt } = require("./shared");
console.log("Database URL:", process.env.DATABASE_URL);

async function createTables() {
  try {
    await client.connect();
    let SQL = `
    CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_money INTEGER NOT NULL,
    wins INTEGER default 0,
    losses INTEGER default 0,
    is_admin BOOLEAN default false
    );
    CREATE TABLE IF NOT EXISTS transactions(
    transaction_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    game TEXT NOT NULL, 
    win_loss BOOLEAN NOT NULL, 
    money INTEGER NOT NULL,
    result TEXT NOT NULL,
    placed_at TIMESTAMP DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS miniGame(
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    game TEXT NOT NULL,
    endTotal INTEGER NOT NULL,
    perfectGame BOOLEAN default false,
    total_wins INTEGER NOT NULL, 
    completed_at TIMESTAMP DEFAULT now()
    );`;

    await client.query(SQL);
    const password = "adminPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserSQL = `
    INSERT INTO users (id, username, email, password, user_money, wins, losses, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

    const users = [
      { username: "benmo", email: "bemorrison16@gmail.com" },
      { username: "david", email: "davidtoelle54@gmail.com" },
      { username: "jose", email: "josehumberto2002@gmail.com" },
    ];

    for (const user of users) {
      await client.query(insertUserSQL, [uuid.v4(), user.username, user.email, hashedPassword, 1000000, 0, 0, true,]);
    }
    console.log("Tables created and seeded successfully.");
  } catch (error) {
    console.error("Error creating tables or seeding data:", error);
  } finally {
    await client.end();
  }
}

createTables();
