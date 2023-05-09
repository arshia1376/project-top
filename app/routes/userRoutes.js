const router = require("express").Router();
const multer=require("multer")
const controller=require("../http/controller/userController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, 'uploads/')},
    filename: function (req, file, cb) {cb(null,Date.now()+ '-'+file.originalname)}
})
const upload = multer({ storage: storage });

router.post("/UserCreate",controller.createUser);
router.post("/login",controller.login)
router.post("/UserSearch",controller.UserSearch);
router.get("/getUserList",controller.getUserList);
// router.get("/fakeUserGenerate",controller.fakeUserGenerate);
router.get("/getUserId/:id",controller.getIdUser);
router.put("/update/:id",controller.update);
router.delete("/delete/:id",controller.delete);

module.exports = router;