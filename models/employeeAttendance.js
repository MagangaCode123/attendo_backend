const mongoose = require("mongoose")

const EmployeeAttendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'on-leave'],
        default: 'present'
    }
}, { timestamps: true });

module.exports = mongoose.model("EmployeeAttendance", EmployeeAttendanceSchema);