import express from "express";
import { login, logout, register, updateProfile, updateProfilePic } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(singleUpload ,register);

router.route('/login').post(login);

router.route('/profile/update').post(isAuthenticated,singleUpload,updateProfile);

router.route('/profile_picture/update').post(isAuthenticated,singleUpload,updateProfilePic);

router.route('/logout').get(logout);


export default router;