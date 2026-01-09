import React, { useState } from 'react';
import axios from 'axios';

const AddClassroom = () => {
    const [formData, setFormData] = useState({
        roomId: '',
        capacity: '',
        floorNo: '1',
        nearWashroom: false
    });
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        try {
            const response = await axios.post('https://shivanksharmaofficial-exam-seat-pla.vercel.app/', {
                ...formData,
                capacity: parseInt(formData.capacity),
                floorNo: parseInt(formData.floorNo)
            });
            
            setMessage(`Classroom ${response.data.roomId} added successfully!`);
            setFormData({
                roomId: '',
                capacity: '',
                floorNo: '1',
                nearWashroom: false
            });
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding classroom');
        }
    };

    return (
        <div className="card">
            <h2>Add Classroom</h2>
            
            {message && <div className="output-panel">{message}</div>}
            {error && <div className="output-panel error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Room ID *</label>
                    <input
                        type="text"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        required
                        placeholder="e.g., R101"
                    />
                </div>
                
                <div className="form-group">
                    <label>Capacity *</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="Number of seats"
                    />
                </div>
                
                <div className="form-group">
                    <label>Floor Number *</label>
                    <input
                        type="number"
                        name="floorNo"
                        value={formData.floorNo}
                        onChange={handleChange}
                        required
                        min="1"
                        max="10"
                    />
                </div>
                
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="nearWashroom"
                            checked={formData.nearWashroom}
                            onChange={handleChange}
                        />
                        Near Washroom
                    </label>
                </div>
                
                <button type="submit" className="btn">Add Classroom</button>
            </form>
        </div>
    );
};

export default AddClassroom;
