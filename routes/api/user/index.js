const router = require('express').Router()
const controller = require('./user.controller')

router.get('/list', controller.list)
router.post('/assign-admin/:username', controller.assignAdmin)
router.post("/profile",controller.showProfile)
router.get("/finances",controller.showFinances)
module.exports = router
