import React, { useState } from 'react';

function Interests(props) {
    const [interestQ1, setInterestQ1] = useState("");
    const [interestQ2, setInterestQ2] = useState("");

    const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'left'
    };

    const textareaStyle = {
        width: '100%', 
        padding: '10px',
        margin: '10px 0',
        boxSizing: 'border-box', 
        minHeight: '150px' 
    };

    const buttonStyle = {
        display: 'block', 
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        margin: '20px auto',
        fontSize: '16px'
    };

    const interestQ1Handler = (event) => {
        setInterestQ1(event.target.value);
    };

    const interestQ2Handler = (event) => {
        setInterestQ2(event.target.value);
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center' }}>Interests</h1>
            <p>1. What hobbies or activities are you involved in?</p>
            <textarea
                placeholder="Describe your interests and hobbies..."
                value={interestQ1}
                onChange={interestQ1Handler}
                style={textareaStyle}
            />
            <p>2. How do they affect your personal development? For example, did team sports improve your teamwork?</p>
            <textarea
                placeholder="How have your interests contributed to your personal development?"
                value={interestQ2}
                onChange={interestQ2Handler}
                style={textareaStyle}
            />
            <button style={buttonStyle}>Submit</button>
        </div>
    );
}

export default Interests;
