const Joi = require('joi');
const validateMakeDeleteInstructor = (req, res, next) => {
    const schema = Joi.object({
        academicID: Joi.string().required(),
        courseName:Joi.string().required()
      
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateUpdateInstructor = (req, res, next) => {
    const schema = Joi.object({
        academicID: Joi.string().required(),
        courseOld:Joi.string().required(),
        courseNew:Joi.string().required()
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateViewStaffByCourseName = (req, res, next) => {
    const schema = Joi.object({
        courseName: Joi.string().required(),
       
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateRejectAcceptRequest = (req, res, next) => {
    const schema = Joi.object({
        _id : Joi.string().length(24).required()
       
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateTeachingAssignmentsOfCourse = (req, res, next) => {
    const schema = Joi.object({
        courseName : Joi.string().required()
       
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  module.exports={
    validateMakeDeleteInstructor,
    validateUpdateInstructor,
    validateViewStaffByCourseName,
    validateRejectAcceptRequest,
    validateTeachingAssignmentsOfCourse
  }