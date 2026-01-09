const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: [true, 'Room ID is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    floorNo: {
        type: Number,
        required: [true, 'Floor number is required'],
        min: [1, 'Floor number must be at least 1']
    },
    nearWashroom: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);