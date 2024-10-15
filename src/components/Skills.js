import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './utils'; 
import '../App.css';

function Skills(props) {
    const navigate = useNavigate();

    const [skillsQ1, setSkillsQ1] = useState("");
    const [skillsQ2, setSkillsQ2] = useState("");
    const [SVM_Skills_AIQ1, setSVM_Skills_AIQ1] = useState("");
    const [SVM_Skills_AIQ2, setSVM_Skills_AIQ2] = useState("");
    const [SVM_Skills_STQ1, setSVM_Skills_STQ1] = useState("");
    const [SVM_Skills_STQ2, setSVM_Skills_STQ2] = useState("");
    const [chatbotResponseSkillsQ1, setChatbotResponseSkillsQ1] = useState("");
    const [chatbotResponseSkillsQ2, setChatbotResponseSkillsQ2] = useState("");
    
    const [showTooltip, setShowTooltip] = useState(false);
    
    const [showSkillsResult1, setShowSkillsResult1] = useState(() => {
        return localStorage.getItem('showSkillsResult1') === 'true';
    });
    const [showSkillsResult2, setShowSkillsResult2] = useState(() => {
        return localStorage.getItem('showSkillsResult2') === 'true';
    });


    useEffect(() => {
        const savedSkills = localStorage.getItem('Skills');
        // 如果 localStorage 中没有 PersonalInfo，则创建一个空的 PersonalInfo 对象并保存到 localStorage
        if (!savedSkills) {
            const initialSkills = {
                Q1: "",
                Q2: ""
            };
            localStorage.setItem('Skills', JSON.stringify(initialSkills));
        }

        const storedSkillsQ1 = localStorage.getItem('Skills1');
        const storedSkillsQ2 = localStorage.getItem('Skills2');
        const storedSVM_Skills_STQ1 = localStorage.getItem('SVM Skills STQ1');
        const storedSVM_Skills_STQ2 = localStorage.getItem('SVM Skills STQ2');
        const storedSVM_Skills_AIQ1 = localStorage.getItem('SVM Skills AIQ1');
        const storedSVM_Skills_AIQ2 = localStorage.getItem('SVM Skills AIQ2');
        const storedChatbotResponseSkillsQ1 = localStorage.getItem('chatbotResponseSkillsQ1');
        const storedChatbotResponseSkillsQ2 = localStorage.getItem('chatbotResponseSkillsQ2');

        if (storedSkillsQ1) setSkillsQ1(storedSkillsQ1); // 从 localStorage 恢复 Q1
        if (storedSkillsQ2) setSkillsQ2(storedSkillsQ2); // 从 localStorage 恢复 Q2
        if (storedSVM_Skills_STQ1) setSVM_Skills_STQ1(storedSVM_Skills_STQ1); // 恢复 SVM ST评分 Q1
        if (storedSVM_Skills_STQ2) setSVM_Skills_STQ2(storedSVM_Skills_STQ2); // 恢复 SVM ST评分 Q2
        if (storedSVM_Skills_AIQ1) setSVM_Skills_AIQ1(storedSVM_Skills_AIQ1); // 恢复 SVM AI评分 Q1
        if (storedSVM_Skills_AIQ2) setSVM_Skills_AIQ2(storedSVM_Skills_AIQ2); // 恢复 SVM AI评分 Q2
        if (storedChatbotResponseSkillsQ1) setChatbotResponseSkillsQ1(storedChatbotResponseSkillsQ1);
        if (storedChatbotResponseSkillsQ2) setChatbotResponseSkillsQ2(storedChatbotResponseSkillsQ2);



        // 还可以设置显示状态
        setShowSkillsResult1(!!storedSVM_Skills_STQ1);
        setShowSkillsResult2(!!storedSVM_Skills_STQ2);
    }, []);
    

    const sendToAI = async (skills, localStorageKey, setResponseState) => {
        const requestPayload = {
            messages: [
                {
                    role: "system",
                    content: "You are a master in writting CV. Please optimize the user's answer based on the questions in the message. Make it more suitable for writing in resume. Return only the optimized answer without any introduction or extra explanations.And don't put “” before or after your reply."
                },
                {
                    role: "user",
                    content: JSON.stringify(skills)
                }
            ]
        };

        try {
            const response = await fetch('http://10.244.159.50:1234/v1/chat/completions', {                
            // const response = await fetch('http://172.25.13.59:1234/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
            });

            if (response.ok) {
                const result = await response.json();

                if (result.choices && result.choices.length > 0) {
                    const processedAnswer = result.choices[0].message.content;
                    localStorage.setItem(localStorageKey, processedAnswer);
                    setResponseState(processedAnswer);  // 更新状态
                    alert("Question completed successfully!");
                }
            } else {
                console.error('Error: Failed to fetch from AI server.');
                alert("An error occurred: AI server response failed.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while submitting requests");
        }
    };

    const sendToSVM = async (content, setRate, localStorageKey) => {
        const csrftoken = getCookie('csrftoken');
        try {
            const response = await fetch('http://127.0.0.1:8000/api/predict/', {
            // const response = await fetch('http://172.25.5.217:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken
                },
                body: new URLSearchParams({ 'content': content, "input_type": "skills"})
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem(localStorageKey, data.predicted_category);
                setRate(data.predicted_category);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleOptimizationQ1 = async () => {
        const skillsQ1Data  = { "What are the relevant skills you have related to the job you want? They can transfer form study, work, and voluntary.": skillsQ1 };
    
        // 将 Q1 的个人声明存储到 localStorage
        localStorage.setItem('showSkillsResult1', JSON.stringify(skillsQ1Data ));
        localStorage.setItem('Skills1', JSON.stringify(skillsQ1));

    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(skillsQ1, setSVM_Skills_STQ1, 'SVM Skills STQ1');
    
        // 优化 Q1，将结果发送到 AI
        await sendToAI(skillsQ1Data , 'chatbotResponseSkillsQ1', setChatbotResponseSkillsQ1);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ1 = localStorage.getItem('chatbotResponseSkillsQ1');
        await sendToSVM(AIToSVMQ1, setSVM_Skills_AIQ1, 'SVM Skills AIQ1');
    
        // 更新状态以触发页面重新渲染
        setShowSkillsResult1(true);
    };

    const handleOptimizationQ2 = async () => {
        const skillsQ2Data = { "Describe in detail what projects or topics you have worked on with these skills.": skillsQ2 };
    
        // 将 Q2 的个人声明存储到 localStorage
        localStorage.setItem('showSkillsResult2', JSON.stringify(skillsQ2Data));
    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(skillsQ2, setSVM_Skills_STQ2, 'SVM Skills STQ2');
    
        // 优化 Q2，将结果发送到 AI
        await sendToAI(skillsQ2Data, 'chatbotResponseSkillsQ2', setChatbotResponseSkillsQ2);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ2 = localStorage.getItem('chatbotResponseSkillsQ2');
        await sendToSVM(AIToSVMQ2, setSVM_Skills_AIQ2, 'SVM Skills AIQ2');
    
        // 更新状态以触发页面重新渲染
        setShowSkillsResult2(true);
    };
    
    // Q1: 将 AI 生成的答案复制到 Q1 的 textarea 中
    const copyAIAnswerToQ1 = () => {
        setSkillsQ1(chatbotResponseSkillsQ1);  // 将 AI 生成的答案复制到 Q1 的文本框中
        localStorage.setItem('Skills1', chatbotResponseSkillsQ1);
    };

    // Q2: 将 AI 生成的答案复制到 Q2 的 textarea 中
    const copyAIAnswerToQ2 = () => {
        setSkillsQ2(chatbotResponseSkillsQ2);  // 将 AI 生成的答案复制到 Q2 的文本框中
        localStorage.setItem('Skills2', chatbotResponseSkillsQ2);
    };

    const saveUserAnswerToLocalStorageQ1 = () => {        
        // const skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
        // skills.Q1 = skillsQ1
        // localStorage.setItem('Skills', JSON.stringify(skills));

        // alert("Your answers have been saved to your CV.");

        let skills = {};
        try {
            // Try to parse the existing data in `Skills`, or default to an object
            skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
        } catch (e) {
            console.error("Failed to parse 'Skills' from localStorage. Resetting to default.", e);
            skills = { Q1: "", Q2: "" }; // Reset to default object if parsing fails
        }

        // Update the Q1 value with the current state
        skills.Q1 = skillsQ1;

        // Save the updated object back to localStorage
        localStorage.setItem('Skills', JSON.stringify(skills));

        alert("Your answers have been saved to your CV.");
    };
    
    const saveUserAnswerToLocalStorageQ2 = () => {
        const skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
        skills.Q2 = skillsQ2
        localStorage.setItem('Skills', JSON.stringify(skills));
        alert("Your answers have been saved to your CV.");
    };

    const chooseAIAnswerForQ1 = () => {
        // 先从 localStorage 获取当前的 PersonalStatement，如果不存在则创建一个空对象
        const skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
    
        // 将 AI 生成的回答保存到 Q1 中
        skills.Q1 = chatbotResponseSkillsQ1;
    
        // 将更新后的对象保存回 localStorage
        localStorage.setItem('Skills', JSON.stringify(skills));
    
        alert("AI answer for Q1 has been saved to your CV.");
    };

    const chooseAIAnswerForQ2 = () => {
        const skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
        skills.Q2 = chatbotResponseSkillsQ2;
        localStorage.setItem('Skills', JSON.stringify(skills));    
        alert("AI answer for Q2 has been saved to your CV.");
    };

    
    // 卡片样式
    const cardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
    };

    // 问题标题样式
    const questionTitleStyle = {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#333'
    };

    // 文本框样式
    const textareaStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        boxSizing: 'border-box',
        fontSize: '1rem',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        resize: 'vertical'
    };

    // 按钮容器样式
    const buttonContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '20px'
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

    // 绿色按钮样式
    const buttonStyleGreen = {
        ...buttonStylePrimary,
        backgroundColor: '#28a745'
    };

    // 蓝色按钮样式
    const buttonStyleBlue = {
        ...buttonStylePrimary,
        backgroundColor: '#007BFF'
    };

    // 答案结果样式
    const answerResultStyle = {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '10px'
    };

    // 鼠标悬停
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };
    
    const containerStyle = {
        display: 'flex',           // 使内容在一行中排列
        justifyContent: 'center',   // 水平居中对齐
        alignItems: 'center',       // 垂直居中对齐
        gap: '10px'                 // p 和 div 之间的间距
      };


    const info = `· The key area of your CV – tailor your skills statements to the ones in advertisements or intended work.\n
    · You could list your skills, then explain how you used them and where, employers need evidence.\n
    · About 8 with a mixture of transferable soft skills such as customer service, interpersonal or problem solving skills from anywhere in your life, and technical / hard skills usually from study / work.\n
    · Start the statement by using action verbs such as created, built, or collaborated.\n
    · Personal attributes like honesty, reliable and friendliness are expected and often what referees comment on.\n
    · Leave out I, me, my after the Personal Statement.
    `

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={containerStyle}>

                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>Key Skills</h1>
                <div
                    className="icon-container"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                
                    <img src= {require("../icon.png")} width="25" height="25"/>
                    {showTooltip && (
                        
                        <div className="tooltip"> 
                            {info.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Q1 卡片布局 */}
            <div style={cardStyle}>
                <p style={questionTitleStyle}>What are the relevant skills you have related to the job you want? They can transfer from study, work, and voluntary.</p>
                <textarea
                    // placeholder="Describe your personal statement..."
                    value={skillsQ1}
                    onChange={(e) => {
                        setSkillsQ1(e.target.value);

                        let skills = JSON.parse(localStorage.getItem('Skills')) || { Q1: "", Q2: "" };
                        skills.Q1 = e.target.value;
                        localStorage.setItem('Skills', JSON.stringify(skills));
                        localStorage.setItem('Skills1', e.target.value); // 保存到 localStorage
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <div>
                        {showSkillsResult1 && (SVM_Skills_STQ1 === "Poor" || SVM_Skills_STQ1 === "Average") && (
                            <p style={answerResultStyle}>
                                Your answer is rated as
                                <span style={{ 
                                    color: SVM_Skills_STQ1 === "Poor" ? 'red' : SVM_Skills_STQ1 === "Average" ? 'orange' : 'black' 
                                }}>
                                    {' '+SVM_Skills_STQ1}
                                </span>.
                                Hover over the yellow icon next to title to see helpful tips on how to write this section effectively.
                            </p>
                        )}

                        {showSkillsResult1 && SVM_Skills_STQ1 === "Excellent" && (
                            <p style={answerResultStyle}>
                                Your answer is rated as 
                                <span style={{ color: 'green' }}>
                                    {' '+SVM_Skills_STQ1}
                                </span>.
                            </p>
                        )}
                    </div>

                    {/* <p style={{ ...answerResultStyle, display: showSkillsResult1 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Skills_STQ1}.
                    </p> */}
                    <button
                        onClick={() => handleOptimizationQ1(skillsQ1, setShowSkillsResult1, setSVM_Skills_STQ1, setSVM_Skills_AIQ1, 'chatbotResponseSkillsQ1', 'showSkillsResult1', 'SVM Skills STQ1', 'SVM Skills AIQ1')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>

                {showSkillsResult1 && (
                    <>
                        <p style={answerResultStyle}>AI answer: {chatbotResponseSkillsQ1}</p>


                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Skills_AIQ1}.</p>
                            <button onClick={copyAIAnswerToQ1} style={buttonStyleGreen}>
                                Copy AI Answer to Edit
                            </button>
                        </div>
                        <br/><br/>
                        <div style={buttonContainerStyle}>
                            <button onClick={saveUserAnswerToLocalStorageQ1} style={buttonStyleBlue}>
                                Choose my answer to the CV
                            </button>
                            <button onClick={chooseAIAnswerForQ1} style={buttonStyleBlue}>
                                Choose AI answer to the CV
                            </button>
                        </div>
                    </>
                )}

            </div>

            {/* Q2 卡片布局 */}
            {/* <div style={cardStyle}>
                <p style={questionTitleStyle}>2. Describe in detail what projects or topics you have worked on with these skills. </p>
                <textarea
                    // placeholder="Describe your goals..."
                    value={skillsQ2}
                    onChange={(e) => {
                        setSkillsQ2(e.target.value);
                        localStorage.setItem('Skills2', e.target.value); // 保存到 localStorage
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <p style={{ ...answerResultStyle, display: showSkillsResult2 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Skills_STQ2}.
                    </p>
                    <button
                        onClick={() => handleOptimizationQ2(skillsQ2, setShowSkillsResult2, setSVM_Skills_STQ2, setSVM_Skills_AIQ2, 'chatbotResponseSkillsQ2', 'showSkillsResult2', 'SVM Skills STQ2', 'SVM Skills AIQ2')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>


                {showSkillsResult2 && (
                    <>
                        <p style={answerResultStyle}>AI answer: {chatbotResponseSkillsQ2}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Skills_AIQ2}.</p>
                            <button onClick={copyAIAnswerToQ2} style={buttonStyleGreen}>
                                Copy AI Answer to Edit
                            </button>
                        </div>
                        <br/><br/>

                        <div style={buttonContainerStyle}>
                            <button onClick={saveUserAnswerToLocalStorageQ2} style={buttonStyleBlue}>
                                Choose my answer to the CV
                            </button>
                            <button onClick={chooseAIAnswerForQ2} style={buttonStyleBlue}>
                                Choose AI answer to the CV
                            </button>
                        </div>
                    </>
                )}

            </div> */}

            <button onClick={() => navigate('/education')} style={buttonStyleBlue}>
                Next Page
            </button>
        </div>


    );
}

export default Skills;