// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GlobalStateContext } from '../GlobalStateContext';


// function PersonalStatement(props) {
//     const { updateFormData } = useContext(GlobalStateContext);

//     const [statementQ1, setStatementQ1] = useState("");
//     const [statementQ2, setStatementQ2] = useState("");
//     const navigate = useNavigate();

//     const containerStyle = {
//         padding: '20px',
//         maxWidth: '600px',
//         margin: 'auto'
//     };

//     const textareaStyle = {
//         width: '100%',
//         padding: '10px',
//         boxSizing: 'border-box',
//         marginBottom: '20px'
//     };

//     const statementQ1Handler = (event) => {
//         setStatementQ1(event.target.value);
//     };

//     const statementQ2Handler = (event) => {
//         setStatementQ2(event.target.value);
//     };

//     const handleSubmit = () => {
//         updateFormData('personal_statement', { statementQ1, statementQ2 });
//         navigate('/skills');
//     };

//     return (
//         <div style={containerStyle}>
//             <h1 style={{ textAlign: 'center' }}>Personal Statement</h1>
//             <p>1. What are your future career goals?</p>
//             <textarea
//                 placeholder="Describe your future career goals..."
//                 value={statementQ1}
//                 onChange={statementQ1Handler}
//                 rows={4}
//                 style={textareaStyle}
//             />
//             <p>2. Why do you think you are suitable for the role you want to apply? Please answer in relation to your skills, experience, and career goals.</p>
//             <textarea
//                 placeholder="Explain why you are suitable..."
//                 value={statementQ2}
//                 onChange={statementQ2Handler}
//                 rows={4}
//                 style={textareaStyle}
//             />
//             <button  onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>
        
//         </div>

//     );
// }

// export default PersonalStatement;



import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../GlobalStateContext';

function Statement(props) {
    const { updateFormData } = useContext(GlobalStateContext);
    const navigate = useNavigate();
    const [statementQ1, setStatementQ1] = useState("");
    const [statementQ2, setStatementQ2] = useState("");

    const handleSubmit = () => {
        updateFormData('personal_statement', {
            statementQ1: statementQ1,
            statementQ2: statementQ2
        });
        navigate('/skills');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Personal Statement</h1>
            <p>1. What is your personal statement?</p>
            <textarea
                placeholder="Describe your personal statement..."
                value={statementQ1}
                onChange={(event) => setStatementQ1(event.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <p>2. What are your personal goals or aspirations?</p>
            <textarea
                placeholder="Describe your goals..."
                value={statementQ2}
                onChange={(event) => setStatementQ2(event.target.value)}
                rows={4}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginBottom: '20px' }}
            />
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>
        </div>
    );
}

export default Statement;
