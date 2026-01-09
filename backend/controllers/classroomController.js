const Classroom = require('backend/models/Classroom');

// Add Classroom
exports.addClassroom = async (req, res) => {
    try {
        const { roomId, capacity, floorNo, nearWashroom } = req.body;
        
        const classroom = new Classroom({
            roomId,
            capacity,
            floorNo,
            nearWashroom: nearWashroom || false
        });
        
        await classroom.save();
        res.status(201).json(classroom);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Classrooms
exports.getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().sort({ floorNo: 1, roomId: 1 });
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Allocate Exam Seats
exports.allocateExamSeats = async (req, res) => {
    try {
        const { totalStudents } = req.body;
        
        // Get all classrooms sorted by floor (ascending) and capacity (descending)
        const classrooms = await Classroom.find().sort({ 
            floorNo: 1, 
            capacity: -1 
        });
        
        let remainingStudents = totalStudents;
        const allocatedClassrooms = [];
        let totalCapacity = 0;
        
        // Calculate total capacity
        classrooms.forEach(room => {
            totalCapacity += room.capacity;
        });
        
        // Check if enough capacity exists
        if (totalCapacity < totalStudents) {
            return res.status(400).json({ 
                error: 'Not enough seats available',
                totalCapacity 
            });
        }
        
        // Greedy allocation: pick rooms with lower floors first
        for (const room of classrooms) {
            if (remainingStudents <= 0) break;
            
            if (room.capacity <= remainingStudents) {
                allocatedClassrooms.push(room);
                remainingStudents -= room.capacity;
            } else {
                // For minimum rooms, take this room even if it has more capacity than needed
                allocatedClassrooms.push(room);
                remainingStudents = 0;
                break;
            }
        }
        
        res.json({
            allocatedClassrooms,
            totalStudentsAllocated: totalStudents - remainingStudents,
            roomsUsed: allocatedClassrooms.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};