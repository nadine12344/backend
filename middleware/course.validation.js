const Joi = require('joi');
const validatePostcourse = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string().required(),
    department:Joi.array().items(Joi.string())
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePutCourse = (req, res, next) => {
    const schema = Joi.object({
      name:Joi.string(),
      department:Joi.array().items(Joi.string())
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  
  const validateDeleteCourse = (req, res, next) => {
    const schema = Joi.object({
     
      department:Joi.string()
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
    validatePostcourse,
    validatePutCourse,
    validateDeleteCourse
  
   }