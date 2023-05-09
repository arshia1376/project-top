const AdminModel = require("../../models/admin");
const _ = require("lodash");
const cityModel = require("../../models/city");
const bcrypt = require("bcrypt");
const {validateCreateAdmin, loginValidator, validateCreate} = require("../validator/adminValidator")
const jwt = require("jsonwebtoken");
const config = require("config");
const generateFakeUser = require('../middleware/faker');
const dataCity = require('../../views/city.json')


class UserController {
    async getAdminList(req, res) {
        const list = await AdminModel.find().select('name email birthdate');
        res.send(list);
    }

    // async getCity(req, res) {
    //     const date = [];
    //     for (let i = 0; i < dataCity.length; i++) {
    //         date.push(dataCity[i].name);
    //     }
    //     res.json(date);
    // }

    async getCity(req, res) {
        const id = req.params.id;
        const list = await cityModel.findById(id).select('name cities');
        const lists=list.cities[6]
        res.send(lists);
    }

    async getState(req, res) {
        const { idCity } = req.query;
        // console.log(typeof stateName+" eee");
        const num = Number(idCity);
        console.log(typeof num)

        for (let i = 0; i < dataCity.length; i++) {
            console.log(typeof dataCity[i].id);
            console.log(dataCity[i].id)
            if (dataCity[i].id === num) {
                res.json(dataCity[i].cities);
                return
            }
        }
        res.send("error")
    }

    async fakeAdminGenerate(req, res) {
        try {
            const fakeUsers = Array.from({length: 10}, generateFakeUser);

            await AdminModel.create(fakeUsers);
            res.send('Fake admin imported successfully!');
        } catch (error) {
            console.error('Error importing admin:', error);
            res.status(500).send('An error occurred during admin import.');
        }
    }


    async getIdAdmin(req, res) {
        const id = req.params.id;
        const admin = await AdminModel.findById(id).select('-adminPassword');
        if (!admin) return res.status(404).send('not found adminId');
        res.send(admin);
    }


    async createAdmin(req, res) {
        const {error} = validateCreate(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = new AdminModel(
            _.pick(req.body, [
                'name',
                'email',
            ]),
        );
        // const salt = await bcrypt.genSalt(10);
        // admin.adminPassword = await bcrypt.hash(admin.adminPassword, salt);
        admin = await admin.save();
        res.send(admin);
    }

    async login(req, res) {
        const {error} = loginValidator(req.body);
        if (error) return res.status(400).send(error.message);
        let admin = await AdminModel.findOne({adminUsername: req.body.userName});
        if (!admin) return res.status(400).send({message: " ادمینی با نام کاربری یا یسورد یافت نشد"});
        const result = await bcrypt.compare(req.body.password, admin.adminPassword);
        if (!result) return res.status(400).send({message: " ادمینی نام کاربری یا یسورد یافت نشد"});
        const token = admin.generateAuthToken();
        res.header("Access-Control-Expose-headers", 'x-auth-token').header('x-auth-token', token).status(200).send({success: true});
    }

    async AdminSearch(req, res) {
        const requestBody = _.pick(req.body, ["name"]);
        if (!requestBody.name) return res.status(400).send({message: "لطفا نام ازسال کنید"});
        let Name = requestBody.name;
        const search = await AdminModel.findOne({name: {'$regex': Name}});
        res.send(search.adminUsername);
    }

    async update(req, res) {
        const id = req.params.id;
        const {error} = validateCreateAdmin(req.body);
        if (error) return res.status(400).send(error.message);
        const result = await AdminModel.findByIdAndUpdate(id, {
            $set: _.pick(req.body, [
                'name',
                'email',
                'birthdate'

            ]),
        });
        if (!result) return res.status(404).send("not found");
        res.send(
            _.pick(req.body, [
                'name',
                'email',
                'birthdate'
            ]),
        );
    }

    async delete(req, res) {
        const id = req.params.id;
        const result = await AdminModel.findByIdAndRemove(id);
        res.send('delete');
    }
}

module.exports = new UserController();