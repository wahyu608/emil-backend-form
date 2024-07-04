import dotenv from "dotenv";
import User from "../models/user.js";
import emailExist from "../libraries/emailExist.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";


const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(
    payload,
    env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
  );
};

const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(
    payload,
    env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME }
  );
};

class AuthController {
  async register(req, res) {
    try {
      // Validasi
      if (!req.body.fullname) {
        throw { code: 400, message: "fullname is required" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "email is required" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "password is required" };
      }
      if (req.body.password.length < 6) {
        throw { code: 400, message: "password minimum 6 karakter" };
      }
      const isEmailExists = await emailExist(req.body.email);
      if (isEmailExists) {
        throw { code: 409, message: "email already exists" };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);

      // Create user
      const user = await User.create(req.body);
      return res.status(201).json({
        user,
        message: "User created successfully",
        status: true,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      // Validasi
      if (!req.body.email) {
        throw { code: 400, message: "email is required" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "password is required" };
      }

      // Find user
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "user not found" };
      }

      // Compare password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        throw { code: 403, message: "password incorrect" };
      }
      let payload = ({id : user._id})
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        fullname: user.fullname,
        message: "User logged in successfully",
        status: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 403, message: "ACCESS_TOKEN_REQUIRED" };
      }
      const verify = jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);

      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH TOKEN SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      const errorJwt =['invalid signature','jwt malformed','jwt must be provided','invalid token']
      if(error.message == 'jwt expired'){
        error.message = "REFRESH_TOKEN_EXPIRED"
      } else if (errorJwt.includes(error.message)) {  
        error.message = 'INVALID_REFRESH_TOKEN'
      }

      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

// Export
export default new AuthController();
