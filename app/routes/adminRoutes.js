const router = require("express").Router();
const multer=require("multer")
const controller=require("../http/controller/adminController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, 'uploads/')},
    filename: function (req, file, cb) {cb(null,Date.now()+ '-'+file.originalname)}
})
const upload = multer({ storage: storage });

router.post("/createAdmin",controller.createAdmin);
router.post("/login",controller.login)
router.post("/AdminSearch",controller.AdminSearch);
router.get("/getAdminList",controller.getAdminList);
router.get("/fakeAdminGenerate",controller.fakeAdminGenerate);
router.get("/getCity/:id",controller.getCity);
router.get("/cities",controller.getState);
router.get("/getAdminId/:id",controller.getIdAdmin);
router.put("/update/:id",controller.update);
router.delete("/delete/:id",controller.delete);

module.exports = router;