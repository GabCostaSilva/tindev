const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {
        
        const { user } = req.headers;
        const { devId } = req.params
        const loggedDev = await Dev.findById(user, (err, user) => {
            if(err) {
                return res.status(400).json({
                    msg: 'Something went wrong',
                    err: err,
                })
            }
            return user
        })

        const targetDev = await Dev.findById(devId, (err, targetDev) => {
            if(err) {
                return res.status(400).json({
                    msg: 'Something went wrong',
                    err: err
                })
            }

            return targetDev
        })
        
        /** TODO criar collection de likes */
        if(targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user]
            const targetSocket = req.connectedUsers[targetDev]
            
            if(loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev)
            }

            if(targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev)
            }
        }
        
        if(!loggedDev.likes.includes(targetDev._id)) {
            loggedDev.likes.push(targetDev._id)
        }
    
        await loggedDev.save()
    
        return res.json({
            msg: `Successfully liked ${targetDev.name}`,
            user: loggedDev
        })
    }
}