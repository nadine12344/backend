const Joi = require('joi');
const validateAssignSlotToMember = (req, res, next) => {
    const schema = Joi.object({
        _id: Joi.string().length(24).required(),
        academicID:Joi.string().required()
      
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateUpdateSlotAssignmentToMember = (req, res, next) => {
    const schema = Joi.object({
        _id: Joi.string().length(24).required(),
        academicID:Joi.string().required(),
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
  const validateDeleteSlotAssignmentFromMember = (req, res, next) => {
    const schema = Joi.object({
        _id: Joi.string().length(24).required(),
        academicID:Joi.string().required()
       
      
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateMakeCoordinator = (req, res, next) => {
    const schema = Joi.object({
        
        academicID:Joi.string().required(),
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
  const validateAssignAcademicToCourse = (req, res, next) => {
    const schema = Joi.object({
        
        academicID:Joi.string().required(),
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
  const validateRemoveAcademicFromCourse = (req, res, next) => {
    const schema = Joi.object({
        
        academicID:Joi.string().required(),
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
  module.exports ={
    validateAssignSlotToMember,
    validateUpdateSlotAssignmentToMember,
    validateDeleteSlotAssignmentFromMember,
    validateMakeCoordinator,
    validateAssignAcademicToCourse,
    validateRemoveAcademicFromCourse
  } 