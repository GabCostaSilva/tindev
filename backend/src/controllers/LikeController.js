const Dev = require('../models/Dev')

module.exports = {
    async store(req, res) {

        const { user } = req.headers;
        const { devId } = req.params
        const loggedDev = Dev.findById(user)
        const targetDev = Dev.findById(devId)
        
        if(!targetDev)
            return res.status(400).json({error: 'Dev does not exist'})
    
        if(targetDev.likes.includes(loggedDev._id))
            console.log('MATCH!!!')
    
        loggedDev.likes.push(targetDev._id)
    
        await loggedDev.save()
    
        res.json(loggedDev)
    }
}