const router = require("express").Router();
const userRoutes=require("./userRoutes");
const adminRoutes=require("./adminRoutes")

router.use(function (req,res,next) {
    res.header('access-control-allow-origin','*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin,x-auth-token,Content-Type,Accept'
    )
    res.header('x-auth-token','123');
    next();
});
router.use('/userPanel',userRoutes)
router.use('/adminPanel',adminRoutes)



module.exports = router;