import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassroomList = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            console.log('Fetching classrooms...');
            
            const response = await axios.get('http://localhost:5000/api/classrooms');
            console.log('API Response:', response.data);
            
            // Check if response has data property
            if (response.data && response.data.success) {
                // If response has data array
                const classroomsData = response.data.data || [];
                console.log('Classrooms data:', classroomsData);
                setClassrooms(classroomsData);
            } else if (Array.isArray(response.data)) {
                // If response is directly an array
                console.log('Response is array:', response.data);
                setClassrooms(response.data);
            } else {
                console.error('Unexpected response structure:', response.data);
                setError('Unexpected data format from server');
                setClassrooms([]);
            }
        } catch (err) {
            console.error('Error fetching classrooms:', err);
            setError('Error fetching classrooms: ' + (err.response?.data?.error || err.message));
            setClassrooms([]);
        } finally {
            setLoading(false);
        }
    };

    const getFloorColor = (floorNo) => {
        switch(floorNo) {
            case 1: return 'floor-1';
            case 2: return 'floor-2';
            case 3: return 'floor-3';
            case 4: return 'floor-4';
            case 5: return 'floor-5';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="card">
                <h2>All Classrooms</h2>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                    <p>Loading classrooms...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <h2>All Classrooms</h2>
                <div className="output-panel error">
                    <h4>❌ Error</h4>
                    <p>{error}</p>
                    <button onClick={fetchClassrooms} className="btn" style={{ marginTop: '1rem' }}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>All Classrooms ({classrooms.length})</h2>
            
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={fetchClassrooms} className="btn" style={{ padding: '0.5rem 1rem' }}>
                    ↻ Refresh List
                </button>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    Total capacity: {classrooms.reduce((sum, room) => sum + room.capacity, 0)} seats
                </div>
            </div>
            
            {classrooms.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Room ID</th>
                            <th>Capacity</th>
                            <th>Floor</th>
                            <th>Near Washroom</th>
                            <th>Added On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map(room => (
                            <tr key={room._id || room.roomId}>
                                <td>
                                    <strong style={{ 
                                        color: '#2c3e50',
                                        backgroundColor: '#f8f9fa',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        display: 'inline-block'
                                    }}>
                                        {room.roomId}
                                    </strong>
                                </td>
                                <td>
                                    <span style={{ 
                                        fontWeight: 'bold',
                                        color: room.capacity > 40 ? '#27ae60' : '#e74c3c'
                                    }}>
                                        {room.capacity} seats
                                    </span>
                                </td>
                                <td>
                                    <span className={`room-badge ${getFloorColor(room.floorNo)}`}>
                                        Floor {room.floorNo}
                                        {room.floorNo === 1 && ' (Ground)'}
                                    </span>
                                </td>
                                <td>
                                    {room.nearWashroom ? (
                                        <span style={{ 
                                            color: '#27ae60',
                                            fontWeight: 'bold'
                                        }}>✓ Yes</span>
                                    ) : (
                                        <span style={{ color: '#95a5a6' }}>No</span>
                                    )}
                                </td>
                                <td>
                                    {room.createdAt ? 
                                        new Date(room.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 
                                        'N/A'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    color: '#7f8c8d',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    marginTop: '1rem'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏫</div>
                    <h3>No Classrooms Found</h3>
                    <p>Add some classrooms to get started!</p>
                    <a 
                        href="/" 
                        style={{
                            display: 'inline-block',
                            marginTop: '1rem',
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#3498db',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Add Classroom
                    </a>
                </div>
            )}
            
            {classrooms.length > 0 && (
                <div style={{ 
                    marginTop: '2rem', 
                    padding: '1rem',
                    backgroundColor: '#e8f4fc',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                }}>
                    <strong>📊 Summary:</strong>
                    <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                        <div>
                            <strong>Total Rooms:</strong> {classrooms.length}
                        </div>
                        <div>
                            <strong>Total Capacity:</strong> {classrooms.reduce((sum, room) => sum + room.capacity, 0)} seats
                        </div>
                        <div>
                            <strong>Average Capacity:</strong> {Math.round(classrooms.reduce((sum, room) => sum + room.capacity, 0) / classrooms.length)} seats/room
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassroomList;