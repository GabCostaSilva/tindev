const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {

        const { user } = req.headers;
        const { devId } = req.params

        const loggedDev = await Dev.findById(user, (err, user) => {
            if(err) {
                return res.status(400).json({
                    msg: 'Something went wrong',
                    error: err
                })
            }
            return user
        })

        const targetDev = await Dev.findById(devId, (err, targetDev) => {
            if(err) {
                return res.status(400).json({
                    msg: 'Something went wrong',
                    error: err
                })
            }

            return targetDev
        })
                
        if(loggedDev.dislikes.includes(targetDev._id)) {
            return res.json({
                msg: `Already disliked ${targetDev.name}`
            })
        }
        
        loggedDev.dislikes.push(targetDev._id)
        
        await loggedDev.save()
    
        return res.json({
            msg: `Disliked ${targetDev.name}`,
            user: loggedDev
        })
    }
}