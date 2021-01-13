const Joi = require('joi');
const validatePostfaculty = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string().required()
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePutfaculty = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string(),
   
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
 
  
  module.exports = {
    validatePostfaculty,
    validatePutfaculty,

   }