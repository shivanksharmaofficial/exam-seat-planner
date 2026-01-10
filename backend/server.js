const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Classroom = require('./models/Classroom');

const app = express();
const PORT = process.env.PORT || 5000;

//* Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
});

// Simple test route
app.get('/', (req, res) => {
    res.json({ message: 'Exam Seat Planner API is running' });
});

// Add Classroom
app.post('/api/classrooms', async (req, res) => {
    try {
        console.log('Received data:', req.body);
        
        const { roomId, capacity, floorNo, nearWashroom } = req.body;
        
        // Validation
        if (!roomId || !capacity || !floorNo) {
            return res.status(400).json({ 
                error: 'Missing required fields: roomId, capacity, floorNo' 
            });
        }
        
        const classroom = new Classroom({
            roomId,
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
        console.error('Error adding classroom:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: `Room ID "${req.body.roomId}" already exists. Please use a different ID.` 
            });
        }
        
        res.status(500).json({ 
            error: 'Error adding classroom: ' + error.message 
        });
    }
});

// Get All Classrooms
app.get('/api/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find().sort({ floorNo: 1, roomId: 1 });
        res.json({ success: true, data: classrooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Allocate Exam Seats
app.post('/api/classrooms/allocate', async (req, res) => {
    try {
        const { totalStudents } = req.body;
        
        if (!totalStudents || totalStudents <= 0) {
            return res.status(400).json({ error: 'Please provide valid totalStudents' });
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
            message: `Allocated ${allocatedClassrooms.length} classroom(s) for ${totalStudents} students`
        });
    } catch (error) {
        console.error('Error allocating seats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Endpoints:`);
    console.log(`GET  http://localhost:${PORT}/`);
    console.log(`POST http://localhost:${PORT}/api/classrooms`);
    console.log(`GET  http://localhost:${PORT}/api/classrooms`);
    console.log(`POST http://localhost:${PORT}/api/classrooms/allocate`);
});
