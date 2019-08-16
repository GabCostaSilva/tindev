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
        
        if(targetDev.likes.includes(loggedDev._id)) {
            console.log('MATCH!!!')
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