function Home(props) {
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

    const headingStyle = {
        fontSize: '2.5rem',
        color: '#007BFF',
        marginBottom: '20px',
    };

    const textStyle = {
        fontSize: '1.1rem',
        textAlign: 'left',
        marginBottom: '20px',
    };

    const linkStyle = {
        color: '#007BFF',
        textDecoration: 'none',
        fontWeight: 'bold',
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>The RealMe CV</h1>
            <p style={textStyle}>
                This website is designed to help you learn how to write an excellent CV. It is divided into five main sections: Personal Information, Interests, Work Experience, Education, Key Skills, and Personal Statement. Each section corresponds to a key part of your CV.
            </p>
            <p style={textStyle}>
                On the website, you can fill in the relevant information and answer questions. Based on your responses, the AI will provide a grade and generate an AI-optimized version of your answers, along with an AI-generated grade. You can review and improve your own answers using the AI suggestions until you are satisfied. In the end, the system will generate a complete CV based on the information you provided.
            </p>
            <p style={textStyle}>
                All the data you input is stored locally in your browser’s database, and we do not collect any personal information. You can use the website with confidence.
            </p>
            <p style={textStyle}>
                When you're done, please take a moment to complete a survey, which will help us improve the program. Here’s the survey link:   
                <a href="https://forms.office.com/r/P2qPkYTpaF" style={linkStyle}>Survey Link</a>
            </p>
        </div>
    );
}

export default Home;
