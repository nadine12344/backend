const Joi = require('joi');
const validatePostdepartment = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string().required(),
    HOD:Joi.string(),
    faculty: Joi.string(),
    courseNames:Joi.array().items(Joi.string()),
    staffIds:Joi.array().items(Joi.string())
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePutdepartment = (req, res, next) => {
    const schema = Joi.object({
      name:Joi.string(),
      HOD:Joi.string(),
      faculty: Joi.string(),
      courseNames:Joi.array().items(Joi.string()),
      staffIds:Joi.array().items(Joi.string())
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
    validatePostdepartment,
    validatePutdepartment
   }