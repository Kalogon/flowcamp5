const User = require('../../../models/user')
const Finance = require('../../../models/finance')
/* 
    GET /api/user/list
*/

exports.list = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.find({}, '-password').exec()
    .then(
        users=> {
            res.json({users})
        }
    )

}


/*
    POST /api/user/assign-admin/:username
*/
exports.assignAdmin = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.findOneByUsername(req.params.username)
    .then(
        user => {
            if(!user) throw new Error('user not found')
            user.assignAdmin()
        }
    ).then(
        res.json({
            success: true
        })
    ).catch(
        (err) => { res.status(404).json({message: err.message})}
    )
}

exports.showProfile = (req,res) => {
    console.log("profile-routes")
    User.findOne({username:req.body.username},function(err,user){
        res.header("Access-Control-Allow-Origin", "*");
        const u = {user:user}
        res.json(u);
    })
}

exports.showFinances = (req,res)=>{
    console.log("finances-routes")
    Finance.find({},function(err,finances){
        const f = {finances:finances};
        res.header("Access-Control-Allow-Origin", "*");
        res.json(f);
    })
}