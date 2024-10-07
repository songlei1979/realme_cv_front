// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GlobalStateContext } from '../GlobalStateContext';

// function KeySkills(props) {
//     const { updateFormData } = useContext(GlobalStateContext);

//     const [skillsQ1, setSkillsQ1] = useState("");
//     const [skillsQ2, setSkillsQ2] = useState("");
//     const navigate = useNavigate();

//     const containerStyle = {
//         padding: '20px',
//         maxWidth: '600px',
//         margin: 'auto',
//         textAlign: 'left'
//     };

//     const textareaStyle = {
//         width: '100%',
//         padding: '10px',
//         boxSizing: 'border-box',
//         marginBottom: '20px',
//         minHeight: '100px' 
//     };

//     const buttonStyle = {
//         padding: '10px 20px',
//         backgroundColor: '#007BFF',
//         color: 'white',
//         border: 'none',
//         cursor: 'pointer',
//         fontSize: '16px' 
//     };

//     const skillsQ1Handler = (event) => setSkillsQ1(event.target.value);
//     const skillsQ2Handler = (event) => setSkillsQ2(event.target.value);

//     const handleSubmit = () => {
//         updateFormData('key_skills', { 
//             content: `Q1: ${skillsQ1}\nQ2: ${skillsQ2}` 
//         });
//         navigate('/education');
//     };


//     return (
//         <div style={containerStyle}>
//             <h1 style={{ textAlign: 'center' }}>Key Skills</h1>
//             <p>1. What kind of skills do you have related to the job you want to apply? Examples include programming languages, software tools, or management skills.</p>
//             <textarea
//                 placeholder="Describe your key skills..."
//                 value={skillsQ1}
//                 onChange={skillsQ1Handler}
//                 style={textareaStyle}
//             />
//             <p>2. Describe in detail what projects or topics you have worked on with these skills. Please provide specific examples, e.g., “Developed a user-friendly interface using Java in XX project”.</p>
//             <textarea
//                 placeholder="Detail your projects and skills..."
//                 value={skillsQ2}
//                 onChange={skillsQ2Handler}
//                 style={textareaStyle}
//             />
//             <button  onClick={handleSubmit} style={buttonStyle}>Next</button>
//         </div>
//     );
// }

// export default KeySkills;



import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../GlobalStateContext';

function Skills(props) {
    const { updateFormData } = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const [skillsQ1, setSkillsQ1] = useState("");
    const [skillsQ2, setSkillsQ2] = useState("");

    const handleSubmit = () => {
        // 提交数据时使用更符合后端的数据结构
        updateFormData('key_skills', { 
            content: `Q1: ${skillsQ1}\nQ2: ${skillsQ2}` 
        });
        navigate('/education');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Key Skills</h1>
            <p>1. What key skills do you have?</p>
            <textarea
                placeholder="Describe your skills..."
                value={skillsQ1}
                onChange={(event) => setSkillsQ1(event.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <p>2. How did you acquire these skills? Did you get them through education, work, or other activities?</p>
            <textarea
                placeholder="Describe how you acquired these skills..."
                value={skillsQ2}
                onChange={(event) => setSkillsQ2(event.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>
        </div>
    );
}

export default Skills;
