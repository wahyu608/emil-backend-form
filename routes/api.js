import express from "express";
import FormController from "../controllers/formController.js";
import AuthController from "../controllers/authController.js";
import jwtAth from "../middlewares/jwtAuth.js";

const router = express.Router();

//Auth
router.post('/register', AuthController.register);
router.post ('/login', AuthController.login);
router.post ('/refresh-token',jwtAth(), AuthController.refreshToken)

//Form
router.get('/forms',jwtAth(), FormController.index)
router.post('/forms',jwtAth(), FormController.store)
router.get('/forms/:id',jwtAth(), FormController.show)
router.put('/forms/:id',jwtAth(), FormController.update)
router.delete('/forms/:id',jwtAth(), FormController.destroy)


export default router;
