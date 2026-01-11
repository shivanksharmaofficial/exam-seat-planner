import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const AllocateExam = () => {
    const [totalStudents, setTotalStudents] = useState('');
    const [allocation, setAllocation] = useState(null);
    const [error, setError] = useState('');
    const [totalCapacity, setTotalCapacity] = useState(0);

    useEffect(() => {
        fetchTotalCapacity();
    }, []);

    const fetchTotalCapacity = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/classrooms/allocate`);
            const total = response.data.reduce((sum, room) => sum + room.capacity, 0);
            setTotalCapacity(total);
        } catch (err) {
            console.error('Error fetching capacity:', err);
        }
    };

    const handleAllocate = async (e) => {
        e.preventDefault();
        setAllocation(null);
        setError('');
        
        if (!totalStudents || totalStudents <= 0) {
            setError('Please enter a valid number of students');
            return;
        }

        try {
            
const response = await axios.post(`${API_URL}/api/classrooms/allocate`, {
    totalStudents: parseInt(totalStudents)
});
            
            setAllocation(response.data);
        } catch (err) {
            if (err.response?.data?.error === 'Not enough seats available') {
                setError(`Not enough seats available. Total capacity: ${err.response.data.totalCapacity}`);
            } else {
                setError(err.response?.data?.error || 'Error allocating seats');
            }
        }
    };

    return (
        <div className="card">
            <h2>Allocate Exam Seats</h2>
            
            <div className="form-group">
                <label>Total Students to Accommodate *</label>
                <input
                    type="number"
                    value={totalStudents}
                    onChange={(e) => setTotalStudents(e.target.value)}
                    required
                    min="1"
                    placeholder="Enter number of students"
                />
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                    Total available capacity: {totalCapacity} seats
                </small>
            </div>
            
            <button 
                onClick={handleAllocate} 
                className="btn btn-allocate"
                disabled={!totalStudents}
            >
                Allocate Seats
            </button>
            
            {error && (
                <div className="output-panel error">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}
            
            {allocation && (
                <div className="output-panel">
                    <h3>Allocation Result</h3>
                    <p>
                        <strong>Total Students:</strong> {allocation.totalStudentsAllocated}<br />
                        <strong>Rooms Used:</strong> {allocation.roomsUsed}<br />
                        <strong>Allocation Efficiency:</strong> {((allocation.totalStudentsAllocated / totalStudents) * 100).toFixed(1)}%
                    </p>
                    
                    <h4 style={{ marginTop: '1rem' }}>Allocated Classrooms:</h4>
                    <table className="table" style={{ marginTop: '0.5rem' }}>
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>Capacity</th>
                                <th>Floor</th>
                                <th>Near Washroom</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allocation.allocatedClassrooms.map(room => (
                                <tr key={room._id}>
                                    <td><strong>{room.roomId}</strong></td>
                                    <td>{room.capacity} seats</td>
                                    <td>Floor {room.floorNo}</td>
                                    <td>{room.nearWashroom ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                        <strong>Allocation Strategy:</strong> 
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                            <li>Classrooms are selected from lower floors first</li>
                            <li>Minimum number of rooms are used</li>
                            <li>Larger capacity rooms are preferred on the same floor</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllocateExam;
