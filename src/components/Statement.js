import React, { useState } from 'react';

function PersonalStatement(props) {

    const [statementQ1, setStatementQ1] = useState("");
    const [statementQ2, setStatementQ2] = useState("");

    const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto'
    };

    const textareaStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        marginBottom: '20px'
    };

    const statementQ1Handler = (event) => {
        setStatementQ1(event.target.value);
    };

    const statementQ2Handler = (event) => {
        setStatementQ2(event.target.value);
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center' }}>Personal Statement</h1>
            <p>1. What are your future career goals?</p>
            <textarea
                placeholder="Describe your future career goals..."
                value={statementQ1}
                onChange={statementQ1Handler}
                rows={4}
                style={textareaStyle}
            />
            <p>2. Why do you think you are suitable for the role you want to apply? Please answer in relation to your skills, experience, and career goals.</p>
            <textarea
                placeholder="Explain why you are suitable..."
                value={statementQ2}
                onChange={statementQ2Handler}
                rows={4}
                style={textareaStyle}
            />
            <button  type="submit" style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Submit</button>
        
        </div>

    );
}

export default PersonalStatement;
