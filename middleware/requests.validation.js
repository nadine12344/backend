const Joi = require('joi')
const {days,slotOrder}=require('../api/enums')

const validateSendReplacementRequest = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    slot:Joi.string().length(24).required(),
    reason:Joi.string().allow(null, ''),
    dateOfRequest:Joi.date().iso().required(),
  })

  const isValid = Joi.validate(req.body, schema)
  if (isValid.error) {
    return res.json({
      statusCode:2,
      error: isValid.error.details[0].message,
    })
  }
  return next()
}



const validateSendSlotLinkingRequest = (req, res, next) => {
    const schema = Joi.object({
      slot:Joi.string().length(24).required(),
      reason:Joi.string().allow(null, '')
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateSendChangeDayOffRequest = (req, res, next) => {
    const schema = Joi.object({
      day:Joi.string().valid(days.SUNDAY,days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.SAUTURDAY).required(),
      reason:Joi.string().allow(null, '')
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateSendAnnualLeaveRequest = (req, res, next) => {
    const schema = Joi.object({
      date:Joi.date().iso().required(),
      reason:Joi.string().allow(null, ''),
      replacements:Joi.array().items(Joi.string().allow(null, '')),
      requests:Joi.array().items(Joi.string().length(24)),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateSendAccidentalLeaveRequest = (req, res, next) => {
    const schema = Joi.object({
        date:Joi.date().iso().required(),
      reason:Joi.string().allow(null, '')
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateSendSickLeaveRequest = (req, res, next) => {
    const schema = Joi.object({
      date:Joi.date().iso().required(),
      reason:Joi.string().allow(null, ''),
      documents:Joi.string().required(),


    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateSendMaternityLeaveRequest = (req, res, next) => {
    const schema = Joi.object({
      date:Joi.date().iso().required(),
      reason:Joi.string().allow(null, ''),
      documents:Joi.string().required(),

    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateSendCompensationLeaveRequest = (req, res, next) => {
    const schema = Joi.object({
      date:Joi.date().iso().required(),
      reason:Joi.string().required(),
      compensationDay:Joi.date().iso().required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateCancelRequest = (req, res, next) => {
    const schema = Joi.object({
        request:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateRejectReplacementRequest = (req, res, next) => {
    const schema = Joi.object({
        request:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateAcceptReplacementRequest = (req, res, next) => {
    const schema = Joi.object({
        request:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateAddSlot = (req, res, next) => {
    const schema = Joi.object({
      startTime:Joi.string().required(),
      endTime:Joi.string().required(),
        day:Joi.string().valid(days.SUNDAY,days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.SAUTURDAY).required(),
        location:Joi.string().required(),
        order:Joi.string().valid(slotOrder.FIRST,slotOrder.SECOND,slotOrder.THIRD,slotOrder.FOURTH,slotOrder.FIFTH).required(),
        course:Joi.string().required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateUpdateSlot = (req, res, next) => {
    const schema = Joi.object({
        startTime:Joi.string().allow(null, ''),
        endTime:Joi.string().allow(null, ''),
        day:Joi.string().valid(days.SUNDAY,days.MONDAY,days.TUESDAY,days.WEDNESDAY,days.THURSDAY,days.SAUTURDAY).allow(null, ''),
        location:Joi.string().allow(null, ''),
        order:Joi.string().valid(slotOrder.FIRST,slotOrder.SECOND,slotOrder.THIRD,slotOrder.FOURTH,slotOrder.FIFTH).allow(null, ''),
        academicMember:Joi.string().allow(null, ''),
        slot:Joi.string().length(24).required()
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateDeleteSlot = (req, res, next) => {
    const schema = Joi.object({
      slot:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateAcceptSlotLinkingRequest = (req, res, next) => {
    const schema = Joi.object({
      request:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  const validateRejectSlotLinkingRequest = (req, res, next) => {
    const schema = Joi.object({
      request:Joi.string().length(24).required(),
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }


  //////////////mariam
  const validateLogin = (req, res, next) => {
    const schema = Joi.object({
      email:Joi.string().required(),
      password:Joi.string().required()
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateUpdateProfile = (req, res, next) => {
    const schema = Joi.object({
      
      email:Joi.string().allow(null, ''),
      gender:Joi.string().allow(null, ''),
      officeLocation:Joi.string().allow(null, ''),
      extraInformation:Joi.string().allow(null, ''),
      password:Joi.string().allow(null, '')
        
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }
  const validateResetPassword = (req, res, next) => {
    const schema = Joi.object({
      password:Joi.string().allow(null, '')
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }

  const validateveiwAttendenceRecords = (req, res, next) => {
    const schema = Joi.object({
      month:Joi.number()
    })
  
    const isValid = Joi.validate(req.body, schema)
    if (isValid.error) {
      return res.json({
        statusCode:2,
        error: isValid.error.details[0].message,
      })
    }
    return next()
  }




module.exports = {
 validateSendReplacementRequest,
 validateSendSlotLinkingRequest,
 validateSendChangeDayOffRequest,
 validateSendAnnualLeaveRequest,
 validateSendAccidentalLeaveRequest,
 validateSendSickLeaveRequest,
 validateSendMaternityLeaveRequest,
 validateSendCompensationLeaveRequest,
 validateCancelRequest,
 validateRejectReplacementRequest,
 validateAcceptReplacementRequest,
 validateAddSlot,
 validateUpdateSlot,
 validateDeleteSlot,
 validateAcceptSlotLinkingRequest,
 validateRejectSlotLinkingRequest,
 validateLogin,
 validateUpdateProfile,
 validateResetPassword,
 validateveiwAttendenceRecords



}
