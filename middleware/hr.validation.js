const Joi = require('joi');
const validatePosthr = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required().email(),
    salary:Joi.number(),
    officeLocation:Joi.string(),
    extraInformation:Joi.string(),
    gender:Joi.string().required().valid('female','male')
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePuthr = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string(),
    email:Joi.string().email(),
    salary:Joi.number(),
    officeLocation:Joi.string(),
    extraInformation:Joi.string(),
    gender:Joi.string().valid('female','male')
    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePutSalaryhr = (req, res, next) => {
    const schema = Joi.object({
    salary:Joi.number(),
      
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
    validatePosthr,
    validatePuthr,
    validatePutSalaryhr
   }