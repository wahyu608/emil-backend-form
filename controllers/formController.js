import mongoose from "mongoose";
import Form from "../models/form.js";

class FormController{

  async index (req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10
      const page = parseInt(req.query.page) || 1

      const form = await Form.paginate({ userId : req.jwt.id}, {limit : limit , page : page})  
      if (!form) {throw{code:404, message: "FORMS_NOT_FOUND"}}

      return res.status(200).json({
        status: true,
        message : 'FORMS_FOUND',
        total : form.length,
        form
      })
    }
    catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message  
      })
      
    }
  }

  async store (req, res) {
    try {
      const form = await Form.create({
        userId : req.jwt.id,
        title : 'Untitled Form',
        description : null,
        public : true
      })

      if (!form) {throw{code:500, message: "FAILED_CREATE_FORM"}}

      return res.status(200).json({
        status: true,
        message : 'SUCCESS_CREATE_FORM',
        form
      })

    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message
      })
      
    }
  }
  async show (req, res) {
    try {
      if(!req.params.id) {throw{code:400, message: "ID_REQUIRED"}}
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw{code:400, message: "INVALID_ID"}}

      const form = await Form.findOne({ userId : req.jwt.id, _id : req.params.id})
      if (!form) {throw{code:404, message: "FORM_NOT_FOUND"}}

      return res.status(200).json({
        status: true,
        message : 'SUCCESS_SHOW_FORM',
        form
      })
    }
    catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message
      })
      
    }
  }
  async update (req, res) {
    try {
      if(!req.params.id) {throw{code:400, message: "ID_REQUIRED"}}
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw{code:400, message: "INVALID_ID"}}

      const form = await Form.findOneAndUpdate({ userId : req.jwt.id, _id : req.params.id}, req.body, {new : true})
      if (!form) {throw{code:404, message: "FORM_UPDATE_FAILED"}}

      return res.status(200).json({
        status: true,
        message : 'SUCCESS_UPDATE_FORM',
        form
      })
    }
    catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message
      })
      
    }
  }

  async destroy (req, res) {
    try {
      if(!req.params.id) {throw{code:400, message: "ID_REQUIRED"}}
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {throw{code:400, message: "INVALID_ID"}}

      const form = await Form.findOneAndDelete({ userId : req.jwt.id, _id : req.params.id})
      if (!form) {throw{code:404, message: "FORM_DELETE_FAILED"}}

      return res.status(200).json({
        status: true,
        message : 'SUCCESS_DELETE_FORM',
        form
      })
    }
    catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message
      })
      
    }
  }

}

export default new FormController()