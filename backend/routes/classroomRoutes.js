const express = require('express');
const router = express.Router();
const {
    addClassroom,
    getAllClassrooms,
    allocateExamSeats
} = require('../controllers/classroomController');

// Add Classroom
router.post('/', addClassroom);

// Get All Classrooms
router.get('/', getAllClassrooms);

// Allocate Exam Seats
router.post('/allocate', allocateExamSeats);

module.exports = router;

