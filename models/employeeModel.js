const mongoose = require("mongoose")

//Schema--->Structure of the data
const EmployeeSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        default: 'employee'
    },
    department: {
        type: String,
        enum: ['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales'],
        required: true
    },
    position: {
        type: String,
        required: true
    },
    hireDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    skills: [String],
    status: {
        type: String,
        enum: ['active', 'on-leave', 'terminated'],
        default: 'active'
    },
    profilePicture: {
        type: String,
        default: ''
    }
},{timestamps:true})


module.exports = mongoose.model("Employee",EmployeeSchema)
