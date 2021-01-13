const Joi = require('joi');
const validatePostlocation = (req, res, next) => {
    const schema = Joi.object({
    name:Joi.string().required(),
    type: Joi.string().valid('tutorial room','lecture halls','offices'),
    capacity:Joi.number()

    })
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validatePutlocation = (req, res, next) => {
    const schema = Joi.object({
      name:Joi.string(),
      type: Joi.string().valid('tutorial room','lecture halls','offices'),
      capacity:Joi.number()
  
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
    validatePostlocation,
    validatePutlocation

   }