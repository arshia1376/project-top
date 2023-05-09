const UserModel = require("../../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {validateCreateAdmin, loginValidator} = require("../validator/adminValidator")
const jwt = require("jsonwebtoken");
const config = require("config");
const generateFakeUser=require('../middleware/faker');


class UserController {
    async getUserList(req, res) {
        const list = await UserModel.find().select('name lastName adminUsername phoneNumber accessLevel');
        res.send(list);
    }

    // async fakeUserGenerate(req,res){
    //     try {
    //         const fakeUsers = Array.from({ length: 10 }, generateFakeUser);
    //
    //         await UserModel.create(fakeUsers);
    //         res.send('Fake admin imported successfully!');
    //     } catch (error) {
    //         console.error('Error importing admin:', error);
    //         res.status(500).send('An error occurred during admin import.');
    //     }
    // }


    async getIdUser(req, res) {
        const id = req.params.id;
        const admin = await UserModel.findById(id).select('-adminPassword');
        if (!admin) return res.status(404).send('not found adminId');
        res.send(admin);
    }


    async createUser(req, res) {
        const {error} = validateCreateAdmin(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = new UserModel(
            _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        );
        const salt = await bcrypt.genSalt(10);
        admin.adminPassword = await bcrypt.hash(admin.adminPassword, salt);
        admin = await admin.save();
        res.send(admin);
    }

    async login(req, res) {
        const {error} = loginValidator(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = await UserModel.findOne({adminUsername: req.body.userName});
        if (!admin) return res.status(400).send({message: " ادمینی با نام کاربری یا یسورد یافت نشد"});
        const result = await bcrypt.compare(req.body.password, admin.adminPassword);
        if (!result) return res.status(400).send({message: " ادمینی نام کاربری یا یسورد یافت نشد"});
        const token = admin.generateAuthToken();
        res.header("Access-Control-Expose-headers", 'x-auth-token').header('x-auth-token', token).status(200).send({success: true});
    }

    async UserSearch(req, res) {
        const requestBody = _.pick(req.body, ["name"]);
        if (!requestBody.name) return res.status(400).send({message: "لطفا نام ازسال کنید"});
        let Name = requestBody.name;
        const search = await UserModel.findOne({name: {'$regex': Name}});
        res.send(search.adminUsername);
    }

    async update(req, res) {
        const id = req.params.id;
        const {error} = validateCreateAdmin(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await UserModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        });
        if (!result) return res.status(404).send("not found");
        res.send(
            _.pick(req.body, [
                'name',
                'phoneNumber',
                'lastName',
                'email',
                'adminUsername',
                'adminPassword',
            ]),
        );
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await UserModel.findByIdAndRemove(id);
        res.send('delete');
    }
}

module.exports = new UserController();