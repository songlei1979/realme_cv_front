import React, { useState } from 'react';

function KeySkills(props) {
    const [skillsQ1, setSkillsQ1] = useState("");
    const [skillsQ2, setSkillsQ2] = useState("");

    const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'left'
    };

    const textareaStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        marginBottom: '20px',
        minHeight: '100px' 
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px' 
    };

    const skillsQ1Handler = (event) => setSkillsQ1(event.target.value);
    const skillsQ2Handler = (event) => setSkillsQ2(event.target.value);

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center' }}>Key Skills</h1>
            <p>1. What kind of skills do you have related to the job you want to apply? Examples include programming languages, software tools, or management skills.</p>
            <textarea
                placeholder="Describe your key skills..."
                value={skillsQ1}
                onChange={skillsQ1Handler}
                style={textareaStyle}
            />
            <p>2. Describe in detail what projects or topics you have worked on with these skills. Please provide specific examples, e.g., “Developed a user-friendly interface using Java in XX project”.</p>
            <textarea
                placeholder="Detail your projects and skills..."
                value={skillsQ2}
                onChange={skillsQ2Handler}
                style={textareaStyle}
            />
            <button style={buttonStyle}>Submit</button>
        </div>
    );
}

export default KeySkills;
