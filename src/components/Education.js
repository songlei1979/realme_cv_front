import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../GlobalStateContext';


function Education(props) {
    const { updateFormData } = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const [educations, setEducations] = useState([
        { major: '', startTime: '', endTime: '', school: '', achievements: ''}
    ]);

    const handleSubmit = () => {
        updateFormData('educations', educations);
        navigate('/work');
    };

    const handleChange = (index, event) => {
        const newEducations = [...educations];
        newEducations[index][event.target.name] = event.target.value;
        setEducations(newEducations);
    };

    const addEducation = () => {
        setEducations([...educations, { major: '', startTime: '', endTime: '', school: '', achievements: '' }]);
    };

    const removeEducation = index => {
        const newEducations = [...educations];
        newEducations.splice(index, 1);
        setEducations(newEducations);
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
            <h1 style={{ textAlign: 'center' }}>Educations</h1>
            {educations.map((item, index) => (
                <div key={index}>
                    <div style={rowStyle}>
                        <input
                            type="text"
                            name="major"
                            placeholder="Major"
                            value={item.major}
                            onChange={(event) => handleChange(index, event)}
                            style={inputStyleHalf}
                        />
                        <input
                            type="text"
                            name="school"
                            placeholder="Institute"
                            value={item.school}
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
                    <p>Describe your academic achievements or notable projects you've worked on during your studies. For example, do you have a thesis, design work, or significant research?</p>
                    <textarea
                        name="achievements"
                        placeholder="Describe your academic achievements or notable projects..."
                        value={item.achievements}
                        onChange={(event) => handleChange(index, event)}
                        rows={4}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
                    />
                    {educations.length > 1 && (
                        <button onClick={() => removeEducation(index)} style={buttonStyle}> - </button>
                    )}
                </div>
            ))}
            <button onClick={addEducation} style={buttonStyle}>+</button>
            <button onClick={handleSubmit} style={buttonStyle}>Next</button>
        </div>
    );
}

export default Education;