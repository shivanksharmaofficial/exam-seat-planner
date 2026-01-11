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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seat_planner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB error:', err));

// Classroom Model
const Classroom = mongoose.model('Classroom', new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true, min: 1 },
    floorNo: { type: Number, required: true, min: 1 },
    nearWashroom: { type: Boolean, default: false }
}, { timestamps: true }));

// API Routes

// Add Classroom
app.post('/api/classrooms', async (req, res) => {
    try {
        const { roomId, capacity, floorNo, nearWashroom } = req.body;
        
        // Check if roomId already exists
        const existing = await Classroom.findOne({ roomId: roomId.toUpperCase() });
        if (existing) {
            return res.status(400).json({ 
                error: `Room ID "${roomId}" already exists. Please use a different ID.` 
            });
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
        console.error('Error:', error);
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
        
        let remainingStudents = parseInt(totalStudents);
        const allocatedClassrooms = [];
        let totalCapacity = 0;
        
        // Calculate total capacity
        classrooms.forEach(room => {
            totalCapacity += room.capacity;
        });
        
        // Check if enough capacity exists
        if (totalCapacity < remainingStudents) {
            return res.status(400).json({ 
                success: false,
                error: 'Not enough seats available',
                totalCapacity,
                required: remainingStudents
            });
        }
        
        // Greedy allocation
        for (const room of classrooms) {
            if (remainingStudents <= 0) break;
            
            allocatedClassrooms.push(room);
            remainingStudents -= room.capacity;
        }
        
        res.json({
            success: true,
            allocatedClassrooms,
            totalStudentsAllocated: totalStudents - remainingStudents,
            roomsUsed: allocatedClassrooms.length,
            totalCapacity: totalCapacity,
            message: `Allocated ${allocatedClassrooms.length} room(s) for ${totalStudents} students`
        });
    } catch (error) {
        console.error('Error allocating seats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve frontend build files
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
