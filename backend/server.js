const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seatplanner';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Continuing without database...');
});

// Classroom Model
const classroomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    floorNo: {
        type: Number,
        required: true,
        min: 1
    },
    nearWashroom: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Classroom = mongoose.model('Classroom', classroomSchema);

// API Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Exam Seat Planner API is working!' });
});

// Add Classroom
app.post('/api/classrooms', async (req, res) => {
    try {
        const { roomId, capacity, floorNo, nearWashroom } = req.body;
        
        if (!roomId || !capacity || !floorNo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const classroom = new Classroom({
            roomId: roomId.toUpperCase().trim(),
            capacity: parseInt(capacity),
            floorNo: parseInt(floorNo),
            nearWashroom: nearWashroom || false
        });
        
        await classroom.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Classroom added successfully',
            classroom 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: `Room ID "${req.body.roomId}" already exists` 
            });
        }
        res.status(500).json({ error: error.message });
    }
});

// Get All Classrooms
app.get('/api/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find().sort({ floorNo: 1, roomId: 1 });
        res.json({ 
            success: true, 
            data: classrooms,
            count: classrooms.length 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Allocate Exam Seats
app.post('/api/classrooms/allocate', async (req, res) => {
    try {
        const { totalStudents } = req.body;
        
        if (!totalStudents || totalStudents <= 0) {
            return res.status(400).json({ error: 'Please provide valid number of students' });
        }
        
        const classrooms = await Classroom.find().sort({ 
            floorNo: 1, 
            capacity: -1 
        });
        
        let remaining = parseInt(totalStudents);
        const allocated = [];
        const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);
        
        if (totalCapacity < remaining) {
            return res.status(400).json({ 
                error: 'Not enough seats available',
                totalCapacity 
            });
        }
        
        for (const room of classrooms) {
            if (remaining <= 0) break;
            allocated.push(room);
            remaining -= room.capacity;
        }
        
        res.json({
            success: true,
            allocatedClassrooms: allocated,
            totalStudentsAllocated: totalStudents - remaining,
            roomsUsed: allocated.length,
            message: `Allocated ${allocated.length} room(s)`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    
    // Handle React routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});
