const Joi = require('joi');

// Validation schema for adding a school
const addSchoolSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(255)
    .messages({
      'string.empty': 'School name is required',
      'string.min': 'School name should be at least 2 characters',
      'any.required': 'School name is required'
    }),
  address: Joi.string().required().trim().min(5).max(255)
    .messages({
      'string.empty': 'Address is required',
      'string.min': 'Address should be at least 5 characters',
      'any.required': 'Address is required'
    }),
  latitude: Joi.number().required().min(-90).max(90)
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number().required().min(-180).max(180)
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});

// Validation schema for listing schools
const listSchoolsSchema = Joi.object({
  latitude: Joi.number().required().min(-90).max(90)
    .messages({
      'number.base': 'Latitude must be a number',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required'
    }),
  longitude: Joi.number().required().min(-180).max(180)
    .messages({
      'number.base': 'Longitude must be a number',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required'
    })
});

// Middleware for validating add school request
const validateAddSchool = (req, res, next) => {
  const { error } = addSchoolSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: errorMessage
    });
  }
  
  next();
};

// Middleware for validating list schools request
const validateListSchools = (req, res, next) => {
  const { error } = listSchoolsSchema.validate(req.query, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: errorMessage
    });
  }
  
  next();
};

module.exports = {
  validateAddSchool,
  validateListSchools
};
