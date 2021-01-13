const Joi = require('joi');
const validatePostattendance = (req, res, next) => {
    const schema = Joi.object({
      signIn:Joi.date(),
      signOut:Joi.date()
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
    validatePostattendance,
  
   }