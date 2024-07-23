const {registerQuery, loginQuery, getUserInfoQuery, editUserQuery} = require('../queries/userQueries')

async function register(req, res, next) {
    try {
        const user = await registerQuery(req.body)
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}


async function login (req, res, next) {
    try {
        const user = await loginQuery(req.body)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

async function getUserInfo(req, res, next) {
    const id = req.user.id;
    try {
        const user = await getUserInfoQuery(id);
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

async function editUser(req, res, next) {
    try {
        const updatedUser = await editUserQuery(req.body);
        res.status(201).json(updatedUser)
    } catch (error) {
        next(error)
    }
}



module.exports = {
    register,
    login,
    getUserInfo,
    editUser
}