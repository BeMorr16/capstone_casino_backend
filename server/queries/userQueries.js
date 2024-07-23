const { jwt, bcrypt, client, uuid } = require("../shared");
const JWT = process.env.JWT || 'sshhh';

async function registerQuery(reqBody) {
    const { username, email, password, mode} = reqBody
    const hashedPassword = await bcrypt.hash(password, 10);
    let money;
    let goal;
    if (mode === 1) {
        money = 10000
        goal = 50000
    } else if (mode === 2) {
        money = 10000
        goal = 100000
    } else {
        money = 15000
        goal = 500000
    }
    let is_admin = false;
    if (email === "bemorrison16@gmail.com" || email === "david@email" || email === "jose@email") {
        is_admin = true;
    }
    const SQL = `
    INSERT INTO users(id, username, email, password, money, goal, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
    const response = await client.query(SQL, [uuid.v4(), username, email, hashedPassword, money, goal, is_admin]);
    const token = await jwt.sign({ id: response.rows[0].id }, JWT, { expiresIn: '1h' });
    return { ...response.rows[0], token };
}


async function loginQuery(reqBody) {
    const { username, password } = reqBody;
    const SQL = `
    SELECT * FROM users WHERE username=$1;`;
    const response = await client.query(SQL, [username]);
    if (!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false) {
        const error = Error('Invalid username and/or password')
        error.status = 401;
        throw error
    }
    const token = await jwt.sign({ id: response.rows[0].id }, JWT, { expiresIn: '1h' });
    return { ...response.rows[0], token };
}


async function findUserWithToken(token) {
    let id;
    try {
        const payload = await jwt.verify(token, JWT);
        id = payload.id;
    } catch (error) {
        const err = Error('Not authorized');
        err.status = 401;
        throw err;
    }
    const SQL = `
    SELECT id, username FROM users WHERE id=$1;`;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
        const err = Error('Not authorized');
        err.status = 401;
        throw err;
    }
    return response.rows[0];
}

async function getUserInfoQuery(id) {
    const SQL = `
    SELECT * FROM users WHERE id=$1;`;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
        const err = Error('No user found');
        err.status = 401;
        throw err;
    }
    return response.rows[0]
}


async function editUserQuery(reqBody) {
    const { id, username, email, password } = reqBody;
    if (!id) {
        const err = new Error('User ID is required in body to edit');
        err.status = 400;
        throw err;
    }
    
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    let params = [username ? username : null, email ? email : null, password ? hashedPassword : null, id];
    const SQL = `
    UPDATE users
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password)
    WHERE id=$4
    RETURNING *;`;
    const response = await client.query(SQL, params);
    if (!response.rows.length) {
        const err = new Error('No user found');
        err.status = 404;
        throw err;
    }
    return response.rows[0];
}

module.exports = {
    registerQuery, 
    loginQuery,
    findUserWithToken,
    getUserInfoQuery,
    editUserQuery
}