import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './utils'; 
import '../App.css';

function Statement(props) {
    const navigate = useNavigate();

    const [statementQ1, setStatementQ1] = useState("");
    const [statementQ2, setStatementQ2] = useState("");
    const [SVM_Rate_AIQ1, setSVM_Rate_AIQ1] = useState("");
    const [SVM_Rate_AIQ2, setSVM_Rate_AIQ2] = useState("");
    const [SVM_Rate_STQ1, setSVM_Rate_STQ1] = useState("");
    const [SVM_Rate_STQ2, setSVM_Rate_STQ2] = useState("");
    const [chatbotResponseStatementQ1, setChatbotResponseStatementQ1] = useState("");
    const [chatbotResponseStatementQ2, setChatbotResponseStatementQ2] = useState("");
    
    const [showTooltip, setShowTooltip] = useState(false);
    
    const [showStatementResult1, setShowStatementResult1] = useState(() => {
        return localStorage.getItem('showStatementResult1') === 'true';
    });
    const [showStatementResult2, setShowStatementResult2] = useState(() => {
        return localStorage.getItem('showStatementResult2') === 'true';
    });


    useEffect(() => {
        const savedPersonalStatement = localStorage.getItem('PersonalStatement');
        // 如果 localStorage 中没有 PersonalInfo，则创建一个空的 PersonalInfo 对象并保存到 localStorage
        if (!savedPersonalStatement) {
            const initialPersonalStatement = {
                Q1: "",
                Q2: ""
            };
            localStorage.setItem('PersonalStatement', JSON.stringify(initialPersonalStatement));
        }

        const storedStatementQ1 = localStorage.getItem('PersonalStatement1');
        const storedStatementQ2 = localStorage.getItem('PersonalStatement2');
        const storedSVM_Rate_STQ1 = localStorage.getItem('SVM Rate STQ1');
        const storedSVM_Rate_STQ2 = localStorage.getItem('SVM Rate STQ2');
        const storedSVM_Rate_AIQ1 = localStorage.getItem('SVM Rate AIQ1');
        const storedSVM_Rate_AIQ2 = localStorage.getItem('SVM Rate AIQ2');
        const storedChatbotResponseQ1 = localStorage.getItem('chatbotResponseStatementQ1');
        const storedChatbotResponseQ2 = localStorage.getItem('chatbotResponseStatementQ2');

        if (storedStatementQ1) setStatementQ1(storedStatementQ1); // 从 localStorage 恢复 Q1
        if (storedStatementQ2) setStatementQ2(storedStatementQ2); // 从 localStorage 恢复 Q2
        if (storedSVM_Rate_STQ1) setSVM_Rate_STQ1(storedSVM_Rate_STQ1); // 恢复 SVM ST评分 Q1
        if (storedSVM_Rate_STQ2) setSVM_Rate_STQ2(storedSVM_Rate_STQ2); // 恢复 SVM ST评分 Q2
        if (storedSVM_Rate_AIQ1) setSVM_Rate_AIQ1(storedSVM_Rate_AIQ1); // 恢复 SVM AI评分 Q1
        if (storedSVM_Rate_AIQ2) setSVM_Rate_AIQ2(storedSVM_Rate_AIQ2); // 恢复 SVM AI评分 Q2
        if (storedChatbotResponseQ1) setChatbotResponseStatementQ1(storedChatbotResponseQ1);
        if (storedChatbotResponseQ2) setChatbotResponseStatementQ2(storedChatbotResponseQ2);



        // 还可以设置显示状态
        setShowStatementResult1(!!storedSVM_Rate_STQ1);
        setShowStatementResult2(!!storedSVM_Rate_STQ2);
    }, []);
    

    const sendToAI = async (personalStatement, localStorageKey, setResponseState) => {
        const requestPayload = {
            messages: [
                {
                    role: "system",
                    content: "You are a master in writting CV. Please optimize the user's answer based on the questions in the message. Make it more suitable for writing in resume. Return only the optimized answer without any introduction or extra explanations.And don't put “” before or after your reply."
                },
                {
                    role: "user",
                    content: JSON.stringify(personalStatement)
                }
            ]
        };

        try {
            // const response = await fetch('http://10.244.159.50:1234/v1/chat/completions', {
            const response = await fetch('http://172.25.13.59:1234/v1/chat/completions', {
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
            // const response = await fetch('http://127.0.0.1:8000/api/predict/', {
            const response = await fetch('http://172.25.0.210:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken
                },
                body: new URLSearchParams({ 'content': content, 'input_type':'statement' })
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
        const personalStatementQ1 = { "Start with your personal statement, with 2-3 sentences outlining what you are studying or have graduated with, your experience, what value you might add and why you have chosen this industry. (Keep concise!)": statementQ1 };
    
        // 将 Q1 的个人声明存储到 localStorage
        localStorage.setItem('showStatementResult1', JSON.stringify(personalStatementQ1));
    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(statementQ1, setSVM_Rate_STQ1, 'SVM Rate STQ1');
    
        // 优化 Q1，将结果发送到 AI
        await sendToAI(personalStatementQ1, 'chatbotResponseStatementQ1', setChatbotResponseStatementQ1);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ1 = localStorage.getItem('chatbotResponseStatementQ1');
        await sendToSVM(AIToSVMQ1, setSVM_Rate_AIQ1, 'SVM Rate AIQ1');
    
        // 更新状态以触发页面重新渲染
        setShowStatementResult1(true);
    };

    const handleOptimizationQ2 = async () => {
        const personalStatementQ2 = { "Why do you think you are suitable for the role you want to apply? Please answer in relation to your skills, experience, and career goals.": statementQ2 };
    
        // 将 Q2 的个人声明存储到 localStorage
        localStorage.setItem('showStatementResult2', JSON.stringify(personalStatementQ2));
    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(statementQ2, setSVM_Rate_STQ2, 'SVM Rate STQ2');
    
        // 优化 Q2，将结果发送到 AI
        await sendToAI(personalStatementQ2, 'chatbotResponseStatementQ2', setChatbotResponseStatementQ2);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ2 = localStorage.getItem('chatbotResponseStatementQ2');
        await sendToSVM(AIToSVMQ2, setSVM_Rate_AIQ2, 'SVM Rate AIQ2');
    
        // 更新状态以触发页面重新渲染
        setShowStatementResult2(true);
    };


    // const submitHandler = async () => {
        
    //     const csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF token
    //     const personalinfo = localStorage.getItem('PersonalInfo');
    //     const personalstatement = localStorage.getItem('PersonalStatement');
    //     const skills = localStorage.getItem('Skills');
    //     const interests = localStorage.getItem('Interests');
    //     const education = localStorage.getItem('Education');
    //     const work = localStorage.getItem('Work');
        
        
    //     fetch('http://127.0.0.1:8000/api/generate-word/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': csrftoken,  // 获取 Django 的 CSRF Token
    //         },
    //         body: JSON.stringify({
    //             "PersonalInfo": personalinfo,
    //             'PersonalStatement':personalstatement,
    //             'Interests':interests,
    //             'Skills':skills,
    //             'Education':education,
    //             'Work':work
    //         })
    //     })
    //     .then(response => response.blob())
    //     .then(blob => {
    //         // 创建下载链接
    //         const url = window.URL.createObjectURL(new Blob([blob]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'myCV.docx');
    //         document.body.appendChild(link);
    //         link.click();
    //         link.parentNode.removeChild(link);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // };
    
    // Q1: 将 AI 生成的答案复制到 Q1 的 textarea 中
    const copyAIAnswerToQ1 = () => {
        setStatementQ1(chatbotResponseStatementQ1);  // 将 AI 生成的答案复制到 Q1 的文本框中
        
        localStorage.setItem('PersonalStatement1', chatbotResponseStatementQ1);
    };

    // Q2: 将 AI 生成的答案复制到 Q2 的 textarea 中
    const copyAIAnswerToQ2 = () => {
        setStatementQ2(chatbotResponseStatementQ2);  // 将 AI 生成的答案复制到 Q2 的文本框中
        localStorage.setItem('PersonalStatement2', chatbotResponseStatementQ2);
    };

    const saveUserAnswerToLocalStorageQ1 = () => {        
        const personalStatement = JSON.parse(localStorage.getItem('PersonalStatement')) || { Q1: "", Q2: "" };
        personalStatement.Q1 = statementQ1
        localStorage.setItem('PersonalStatement', JSON.stringify(personalStatement));

        alert("Your answers have been saved to your CV.");
    };
    
    const saveUserAnswerToLocalStorageQ2 = () => {
        const personalStatement = JSON.parse(localStorage.getItem('PersonalStatement')) || { Q1: "", Q2: "" };
        personalStatement.Q2 = statementQ2
        localStorage.setItem('PersonalStatement', JSON.stringify(personalStatement));
        alert("Your answers have been saved to your CV.");
    };

    const chooseAIAnswerForQ1 = () => {
        // 先从 localStorage 获取当前的 PersonalStatement，如果不存在则创建一个空对象
        const personalStatement = JSON.parse(localStorage.getItem('PersonalStatement')) || { Q1: "", Q2: "" };
    
        // 将 AI 生成的回答保存到 Q1 中
        personalStatement.Q1 = chatbotResponseStatementQ1;
    
        // 将更新后的对象保存回 localStorage
        localStorage.setItem('PersonalStatement', JSON.stringify(personalStatement));
    
        alert("AI answer has been saved to your CV.");
    };

    const chooseAIAnswerForQ2 = () => {
        const personalStatement = JSON.parse(localStorage.getItem('PersonalStatement')) || { Q1: "", Q2: "" };
        personalStatement.Q2 = chatbotResponseStatementQ2;
        localStorage.setItem('PersonalStatement', JSON.stringify(personalStatement));    
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
    const info = `· Tell employers why you chose this course / industry. To help answer your why, ask yourself - why did I choose this qualification – and with each answer ask another question – then you should arrive at your central purpose.\n
    · Write about your goals and what problem you are trying to solve.\n
    · Include a few skills you have which will add value to the role.\n
    · Adapt it each time, potentially including some words from the job description / their values.`

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={containerStyle}>

                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>Personal Statement</h1>
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
                <p style={questionTitleStyle}>Start with your personal statement, with 2-3 sentences outlining what you are studying or have graduated with, your experience, what value you might add and why you have chosen this industry. (Keep concise!)</p>
                <textarea
                    placeholder="Describe your personal statement..."
                    value={statementQ1}
                    onChange={(e) => {
                        setStatementQ1(e.target.value);
                        let statement = JSON.parse(localStorage.getItem('PersonalStatement')) || { Q1: "", Q2: "" };
                        statement.Q1 = e.target.value;
                        localStorage.setItem('PersonalStatement', JSON.stringify(statement));

                        localStorage.setItem('PersonalStatement1', e.target.value); // 保存到 localStorage
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    {/* <p style={{ ...answerResultStyle, display: showStatementResult1 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Rate_STQ1}.
                    </p> */}
                    <div>
                        {showStatementResult1 && (SVM_Rate_STQ1 === "Poor" || SVM_Rate_STQ1 === "Average") && (
                            <p style={answerResultStyle}>
                                Your answer is rated as
                                <span style={{ 
                                    color: SVM_Rate_STQ1 === "Poor" ? 'red' : SVM_Rate_STQ1 === "Average" ? 'orange' : 'black' 
                                }}>
                                    {' '+SVM_Rate_STQ1}
                                </span>.
                                Hover over the yellow icon next to title to see helpful tips on how to write this section effectively.
                            </p>
                        )}

                        {showStatementResult1 && SVM_Rate_STQ1 === "Excellent" && (
                            <p style={answerResultStyle}>
                                Your answer is rated as 
                                <span style={{ color: 'green' }}>
                                    {' '+SVM_Rate_STQ1}
                                </span>.
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => handleOptimizationQ1(statementQ1, setShowStatementResult1, setSVM_Rate_STQ1, setSVM_Rate_AIQ1, 'chatbotResponseStatementQ1', 'showStatementResult1', 'SVM Rate STQ1', 'SVM Rate AIQ1')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>

                {showStatementResult1 && (
                    <>
                        <p style={answerResultStyle}>AI answer: {chatbotResponseStatementQ1}</p>


                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Rate_AIQ1}.</p>
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
                <p style={questionTitleStyle}>2. Why do you think you are suitable for the role you want to apply?</p>
                <textarea
                    placeholder="Describe your goals..."
                    value={statementQ2}
                    onChange={(e) => {
                        setStatementQ2(e.target.value);
                        localStorage.setItem('PersonalStatement2', e.target.value); // 保存到 localStorage
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <p style={{ ...answerResultStyle, display: showStatementResult2 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Rate_STQ2}.
                    </p>
                    <button
                        onClick={() => handleOptimizationQ2(statementQ2, setShowStatementResult2, setSVM_Rate_STQ2, setSVM_Rate_AIQ2, 'chatbotResponseStatementQ2', 'showStatementResult2', 'SVM Rate STQ2', 'SVM Rate AIQ2')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>


                {showStatementResult2 && (
                    <>
                        <p style={answerResultStyle}>AI answer: {chatbotResponseStatementQ2}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Rate_AIQ2}.</p>
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

            <button onClick={() => navigate('/skills')} style={buttonStyleBlue}>
                Next Page
            </button>

            
            {/* <button onClick={submitHandler} style={buttonStyleBlue}>Submit</button> */}
        </div>


    );
}

export default Statement;