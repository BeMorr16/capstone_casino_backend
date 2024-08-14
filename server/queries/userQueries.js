const { jwt, bcrypt, client, uuid } = require("../shared");
const JWT = process.env.JWT || '12345';

async function registerQuery(reqBody) {
    try {
        const { username, email, password} = reqBody
        const hashedPassword = await bcrypt.hash(password, 10);
        let money = 5000;
        let is_admin = false;
        if (["bemorrison16@gmail.com", "davidtoelle54@gmail.com", "josehumberto2002@gmail.com"].includes(email)) {
                is_admin = true;
            }
        const SQL = `INSERT INTO users(id, username, email, password, user_money, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const response = await client.query(SQL, [uuid.v4(), username, email, hashedPassword, money, is_admin]);
        const token = await jwt.sign({ id: response.rows[0].id }, JWT, { expiresIn: '5h' });
        return { ...response.rows[0], token };
    } catch (error) {
        throw new Error(`Error registering user: ${error.message}`);
    }
}


async function loginQuery(reqBody) {
    try {
        const { username, password } = reqBody;
        const SQL = `SELECT * FROM users WHERE username=$1;`;
        const response = await client.query(SQL, [username]);
        if (!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false) {
            const error = Error('Invalid username and/or password')
            error.status = 401;
            throw error
        }
        const token = await jwt.sign({ id: response.rows[0].id }, JWT, { expiresIn: '5h' });
        return { ...response.rows[0], token };
    } catch (error) {
        throw new Error(`Error logging in user: ${error.message}`);
    }
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
    SELECT id, username, password FROM users WHERE id=$1;`;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
        const err = Error('Not authorized');
        err.status = 401;
        throw err;
    }
    return response.rows[0];
}

async function getUserInfoQuery(id) {
    try {
        const SQL = `SELECT * FROM users WHERE id=$1;`;
        const response = await client.query(SQL, [id]);
        if (!response.rows.length) {
            const err = Error('No user found');
            err.status = 401;
            throw err;
        }
        return response.rows[0]
    } catch (error) {
        throw new Error(`Error getting user information: ${error.message}`);
    }
}


async function editUserQuery(reqBody, reqUser) {
    try {
        const { id, username, email, password, confirmPassword, money, win_loss, game } = reqBody;
    if (!id) {
        const err = new Error('User ID is required in body to edit');
        err.status = 400;
        throw err;
    }
    let wins = null;
    let losses = null;
    if (win_loss && game !== "slots") {
        wins = 1;
    } else if (win_loss === false && money !== 0 && game !== "slots") {
        losses = 1;
    }
    let passwordToAdd = null;
        if (password) {
        const user = reqUser
            const isMatch = await bcrypt.compare(confirmPassword, user.password);
        if (!isMatch) {
            const err = new Error('Incorrect current password');
            err.status = 400;
            throw err;
        }
        passwordToAdd = password ? await bcrypt.hash(password, 10) : null;
    }
    let params = [username ? username : null, email ? email : null, passwordToAdd || null, money ? money : null, wins ? wins : null, losses ? losses : null, id];
        const SQL = `
    UPDATE users
    SET
    username = COALESCE($1, username),
    email = COALESCE($2, email),
    password = COALESCE($3, password),
    user_money = COALESCE(user_money, 0) + COALESCE($4, 0),
    wins = COALESCE(wins, 0) + COALESCE($5, 0),
    losses = COALESCE(losses, 0) + COALESCE($6, 0)
    WHERE id=$7
    RETURNING *;`;
        const response = await client.query(SQL, params);
    if (!response.rows.length) {
        const err = new Error('No user found');
        err.status = 404;
        throw err;
    }
    return response.rows[0];
   } catch (error) {
        const err = new Error('Error editing user', error.message);
       err.status = 500;
        throw err;
   }
}

module.exports = {
    registerQuery, 
    loginQuery,
    findUserWithToken,
    getUserInfoQuery,
    editUserQuery
}