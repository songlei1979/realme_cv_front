import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../GlobalStateContext';

function PersonalInfo(props) {
    const { updateFormData } = useContext(GlobalStateContext);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 获取 temp_id
        const fetchTempID = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/generate-temp-id/');
                if (response.ok) {
                    const data = await response.json();
                    updateFormData('temp_id', data.temp_id);  // 保存到全局状态中
                } else {
                    throw new Error('Failed to generate temp_id');
                }
            } catch (error) {
                console.error('Error fetching temp_id:', error);
            }
        };

        fetchTempID();
    }, []);

    
    const handleSubmit = () => {
        updateFormData('personal_info', { name, phone, email, linkedIn });

        navigate('/statement');
    };

    const inputStyle = {
        padding: '10px',
        margin: '10px 0',
        width: 'calc(100% - 22px)', 
        boxSizing: 'border-box'
    };

    const nameHandler = (event) => setName(event.target.value);
    const phoneHandler = (event) => setPhone(event.target.value);
    const emailHandler = (event) => setEmail(event.target.value);
    const linkedInHandler = (event) => setLinkedIn(event.target.value);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Personal Info</h1>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                <input
                    id="name"
                    placeholder='Name'
                    type='text'
                    value={name}
                    onChange={nameHandler}
                    style={inputStyle}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
                <input
                    id="phone"
                    placeholder='Phone'
                    type='text'
                    value={phone}
                    onChange={phoneHandler}
                    style={inputStyle}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                <input
                    id="email"
                    placeholder='Email'
                    type='text'
                    value={email}
                    onChange={emailHandler}
                    style={inputStyle}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="linkedIn" style={{ display: 'block', marginBottom: '5px' }}>LinkedIn:</label>
                <input
                    id="linkedIn"
                    placeholder='LinkedIn'
                    type='text'
                    value={linkedIn}
                    onChange={linkedInHandler}
                    style={inputStyle}
                />
            </div>
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>
        </div>    
    );
}

export default PersonalInfo;
