const { client } = require('./shared')

async function createTables() {
    await client.connect();
    const SQL = `
    CREATE TABLE IF NOT EXISTS users(
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    money INTEGER NOT NULL,
    goal INTEGER NOT NULL,
    wins INTEGER default 0,
    loss INTEGER default 0,
    is_admin BOOLEAN default false
    );
    CREATE TABLE IF NOT EXISTS transactions(
    transaction_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    game TEXT NOT NULL, 
    win_loss BOOLEAN NOT NULL, 
    money INTEGER NOT NULL,
    result TEXT NOT NULL
    );`
    await client.query(SQL);
    await client.end();
}

createTables();
