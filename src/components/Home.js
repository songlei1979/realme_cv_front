import { useNavigate } from 'react-router-dom';

function Home(props) {
    
    const navigate = useNavigate();

    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    };

    const textStyle = {
        fontSize: '1.1rem',
        textAlign: 'left',
        marginBottom: '20px',
    };

    // 按钮样式
    const buttonStylePrimary = {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textAlign: 'center',
        fontWeight: 'bold',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
    };
    
    // 蓝色按钮样式
    const buttonStyleBlue = {
        ...buttonStylePrimary,
        backgroundColor: '#007BFF'
    };


    const handleSubmit = () => {
        navigate('/personal-info');
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>The RealMe CV</h1>
            <p style={textStyle}>
                This website is designed to help you learn how to write an excellent CV. It is divided into five main sections: Personal Information, Personal Statement, Key Skills, Education, Work Experience, and Interests. Each section corresponds to a key part of your CV.
            </p>
            <p style={textStyle}>
                On the website, you can fill in the relevant information and answer questions. Based on your responses, the AI will provide a rating and generate an AI-optimized version of your answers, along with an AI-generated rating. You can review and improve your own answers using the AI suggestions until you are satisfied. In the end, the system will generate a complete CV based on the information you provided. Next to each title, there is a hint icon<img src= {require("../icon.png")} width="15" height="15"/>. Hovering over the icon will display key tips to consider when completing that section.
            </p>
            <p style={textStyle}>
                All the data you input is stored locally in your browser’s database, and we do not collect any personal information. You can use the website with confidence.
            </p>
            <p style={textStyle}>
                When you're done, please take a moment to complete a survey, which will help us improve the program. 
            </p>
            
            <button onClick={handleSubmit} style={buttonStyleBlue}>Let's start</button>
        </div>
        
    );
}

export default Home;
