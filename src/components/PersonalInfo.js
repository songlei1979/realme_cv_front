import React, { useState } from 'react';

function PersonalInfo(props) {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");

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
            <button style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Submit</button>
        </div>    
    );
}

export default PersonalInfo;
