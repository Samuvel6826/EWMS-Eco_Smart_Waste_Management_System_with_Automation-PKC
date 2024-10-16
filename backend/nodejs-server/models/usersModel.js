const mongoose = require('mongoose');
const { getFormattedDate } = require('../utils/deviceMonitoring');

// Validation function for email
const emailValidator = {
  validator: (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  },
  message: 'Invalid email format',
};

// Validation function for phone number
const phoneValidator = {
  validator: (phone) => {
    // Accept empty string or a valid phone number
    const phonePattern = /^(?:\+?\d{1,3})?\s?\d{10}$/; // Adjust regex as needed
    return phone === '' || phonePattern.test(phone);
  },
  message: 'Invalid phone number format',
};

// User Schema
const usersSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: emailValidator,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    validate: phoneValidator,
    default: "",
    trim: true
  },
  userDesc: {
    type: String,
    default: "",
    trim: true
  },
  profilePic: {
    type: String,
    default: "",
    trim: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Supervisor', 'Technician'],
    required: [true, 'Role is required'],
    trim: true
  },
  assignedBinLocations: [{
    type: String,
    default: []
  }],
  createdAt: {
    type: String,
    default: getFormattedDate
  },
  updatedAt: {
    type: String,
    default: getFormattedDate
  }
},
  {
    versionKey: false,
    collection: 'ewms-users',
    timestamps: true
  });

// Middleware to format timestamps
usersSchema.pre('save', function (next) {
  const currentDate = getFormattedDate();
  this.createdAt = this.createdAt || currentDate;
  this.updatedAt = currentDate;
  next();
});

// User Model
const usersModel = mongoose.model('ewms-users', usersSchema);

module.exports = usersModel;