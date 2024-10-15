import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PersonalInfo(props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const navigate = useNavigate();

    // Load data from localStorage when component mounts
    useEffect(() => {
        // 尝试从 localStorage 中获取 PersonalInfo
        const savedPersonalInfo = localStorage.getItem('PersonalInfo');
        
        // 如果 localStorage 中没有 PersonalInfo，则创建一个空的 PersonalInfo 对象并保存到 localStorage
        if (!savedPersonalInfo) {
            const initialPersonalInfo = {
                name: "",
                phone: "",
                email: "",
                linkedin: ""
            };
            localStorage.setItem('PersonalInfo', JSON.stringify(initialPersonalInfo));
        } else {
            // 如果 localStorage 中有 PersonalInfo，解析并更新 state
            const parsedPersonalInfo = JSON.parse(savedPersonalInfo);
            setName(parsedPersonalInfo.name || "");
            setPhone(parsedPersonalInfo.phone || "");
            setEmail(parsedPersonalInfo.email || "");
            setLinkedIn(parsedPersonalInfo.linkedin || "");
        }
    }, []);

    // Helper to save any updates directly to localStorage under 'PersonalInfo'
    const handleInputChange = (key, value) => {
        switch (key) {
            case 'name':
                setName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'linkedin':
                setLinkedIn(value);
                break;
            default:
                break;
        }

        // Update the object in localStorage
        const currentData = JSON.parse(localStorage.getItem('PersonalInfo')) || {};
        currentData[key] = value;
        localStorage.setItem('PersonalInfo', JSON.stringify(currentData));
    };

    const handleSubmit = () => {
        navigate('/statement');  // Navigate to the next page
    };


    // Button and other styles (same as before)
    const buttonStyleBlue = {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease'
    };

    const cardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
    };

    const textareaStyle = {
        padding: '10px',
        margin: '10px 0',
        width: 'calc(100% - 22px)',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    };

    const questionTitleStyle = {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Personal Info</h1>

            <div style={cardStyle}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={questionTitleStyle}>Name:</label>
                    <input
                        id="name"
                        placeholder='Name'
                        type='text'
                        value={name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        style={textareaStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="phone" style={questionTitleStyle}>Phone:</label>
                    <input
                        id="phone"
                        placeholder='Phone'
                        type='text'
                        value={phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        style={textareaStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={questionTitleStyle}>Email:</label>
                    <input
                        id="email"
                        placeholder='Email'
                        type='text'
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        style={textareaStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="linkedIn" style={questionTitleStyle}>LinkedIn:</label>
                    <input
                        id="linkedIn"
                        placeholder='LinkedIn'
                        type='text'
                        value={linkedIn}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        style={textareaStyle}
                    />
                </div>

                <button onClick={handleSubmit} style={buttonStyleBlue}>Next Page</button>
            </div>
        </div>
    );
}

export default PersonalInfo;
