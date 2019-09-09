const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
    async index(req, res) {
        const { user } = req.headers

        const loggedDev = await Dev.findById(user).exec()

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.dislikes } }
            ]
        })

        return res.json(users)
    },

    async store(req, res) {
        try {
            const { username } = req.body

            const user = await Dev.findOne({ user: username })
            
            if (user)
                return res.json({
                    user
                })

            const response = await axios.get(`https://api.github.com/users/${username}`)

            const { name, bio, avatar_url: avatar } = response.data

            const createdDev = await Dev.create({
                name,
                user: username,
                bio,
                avatar
            })

            return res.json({
                createdDev
            })

        }  catch(e) {
            return res.json({
                error: e.message
            })
        }       
    }
}