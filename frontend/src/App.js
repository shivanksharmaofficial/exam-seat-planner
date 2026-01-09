import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import AddClassroom from './components/AddClassroom';
import ClassroomList from './components/ClassroomList';
import AllocateExam from './components/AllocateExam';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <h1>College Exam Seat Planner</h1>
                    <div className="nav-links">
                        <Link to="/">Add Classroom</Link>
                        <Link to="/classrooms">View Classrooms</Link>
                        <Link to="/allocate">Allocate Exam</Link>
                    </div>
                </nav>
                
                <div className="container">
                    <Routes>
                        <Route path="/" element={<AddClassroom />} />
                        <Route path="/classrooms" element={<ClassroomList />} />
                        <Route path="/allocate" element={<AllocateExam />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;