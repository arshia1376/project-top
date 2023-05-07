const router = require("express").Router();
const AdminRoutes=require("./adminRoutes")

router.use(function (req,res,next) {
    res.header('access-control-allow-origin','*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,x-auth-token,Content-Type,Accept'
    )
    res.header('x-auth-token','123');
    next();
});
router.use('/adminPanel',AdminRoutes)



module.exports = router;