import React, { useState } from 'react';

function Works(props) {
    const [work, setWork] = useState([
        { job_title: '', startTime: '', endTime: '', organisation: '', tasks: '', achievements: '' }
    ]);

    const handleChange = (index, event) => {
        const newWork = [...work];
        newWork[index][event.target.name] = event.target.value;
        setWork(newWork);
    };

    const addWork = () => {
        setWork([...work, { job_title: '', startTime: '', endTime: '', organisation: '', tasks: '', achievements: '' }]);
    };

    const removeWork = index => {
        const newWork = [...work];
        newWork.splice(index, 1);
        setWork(newWork);
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    };

    const inputStyleHalf = {
        padding: '8px',
        flex: '1 1 48%', 
        margin: '0 1%', 
        boxSizing: 'border-box'
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        margin: '10px 5px 10px 0'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Work Experience</h1>
            {work.map((item, index) => (
                <div key={index}>
                    <div style={rowStyle}>
                        <input
                            type="text"
                            name="job_title"
                            placeholder="Job Title"
                            value={item.job_title}
                            onChange={(event) => handleChange(index, event)}
                            style={inputStyleHalf}
                        />
                        <input
                            type="text"
                            name="organisation"
                            placeholder="Organisation"
                            value={item.organisation}
                            onChange={(event) => handleChange(index, event)}
                            style={inputStyleHalf}
                        />
                    </div>
                    <div style={rowStyle}>
                        <input
                            type="text"
                            name="startTime"
                            placeholder="Start Time"
                            value={item.startTime}
                            onChange={(event) => handleChange(index, event)}
                            style={inputStyleHalf}
                        />
                        <input
                            type="text"
                            name="endTime"
                            placeholder="End Time"
                            value={item.endTime}
                            onChange={(event) => handleChange(index, event)}
                            style={inputStyleHalf}
                        />
                    </div>
                    <textarea
                        name="tasks"
                        placeholder="Tasks"
                        value={item.tasks}
                        onChange={(event) => handleChange(index, event)}
                        rows={4}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
                    />
                    <p>Tell me about your relevant work experience or projects that you've worked on. Try to provide quantifiable results, such as “Helped the department improve productivity by 20% through process optimization”.</p>
                    <textarea
                        name="achievements"
                        placeholder="Tell me about your experience or projects..."
                        value={item.achievements}
                        onChange={(event) => handleChange(index, event)}
                        rows={6}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
                    />
                    {work.length > 1 && (
                        <button onClick={() => removeWork(index)} style={buttonStyle}> - </button>
                    )}
                </div>
            ))}
            <button onClick={addWork} style={buttonStyle}>+</button>
            <button style={buttonStyle}>Submit</button>
        </div>
    );
}

export default Works;
