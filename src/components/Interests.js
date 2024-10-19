import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './utils'; 
import '../App.css';

function Interests(props) {
    const navigate = useNavigate();
    const [interests, setInterests] = useState("");

    const [interestsQ1, setInterestsQ1] = useState("");
    const [interestsQ2, setInterestsQ2] = useState("");
    const [SVM_Interests_AIQ1, setSVM_Interests_AIQ1] = useState("");
    const [SVM_Interests_AIQ2, setSVM_Interests_AIQ2] = useState("");
    const [SVM_Interests_STQ1, setSVM_Interests_STQ1] = useState("");
    const [SVM_Interests_STQ2, setSVM_Interests_STQ2] = useState("");
    const [chatbotResponseInterestsQ1, setChatbotResponseInterestsQ1] = useState("");
    const [chatbotResponseInterestsQ2, setChatbotResponseInterestsQ2] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    
    const [showInterestsResult1, setShowInterestsResult1] = useState(() => {
        return localStorage.getItem('showInterestsResult1') === 'true';
    });
    const [showInterestsResult2, setShowInterestsResult2] = useState(() => {
        return localStorage.getItem('showInterestsResult2') === 'true';
    });

    // 鼠标悬停
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    useEffect(() => {
        const savedInterests = localStorage.getItem('Interests');
        // 如果 localStorage 中没有 PersonalInfo，则创建一个空的 PersonalInfo 对象并保存到 localStorage
        if (!savedInterests) {
            const initialInterests = {
                Q1: "",
                Q2: ""
            };
            localStorage.setItem('Interests', JSON.stringify(initialInterests));
        }
        // const interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
        const storedInterestsQ1 = localStorage.getItem('Interests1');
        const storedInterestsQ2 = localStorage.getItem('Interests2');
        const storedSVM_Interests_STQ1 = localStorage.getItem('SVM Interests STQ1');
        const storedSVM_Interests_STQ2 = localStorage.getItem('SVM Interests STQ2');
        const storedSVM_Interests_AIQ1 = localStorage.getItem('SVM Interests AIQ1');
        const storedSVM_Interests_AIQ2 = localStorage.getItem('SVM Interests AIQ2');
        const storedChatbotResponseInterestsQ1 = localStorage.getItem('chatbotResponseInterestsQ1');
        const storedChatbotResponseInterestsQ2 = localStorage.getItem('chatbotResponseInterestsQ2');

        if (storedInterestsQ1) setInterestsQ1(storedInterestsQ1); // 从 localStorage 恢复 Q1
        if (storedInterestsQ2) setInterestsQ2(storedInterestsQ2); // 从 localStorage 恢复 Q2
        if (storedSVM_Interests_STQ1) setSVM_Interests_STQ1(storedSVM_Interests_STQ1); // 恢复 SVM ST评分 Q1
        if (storedSVM_Interests_STQ2) setSVM_Interests_STQ2(storedSVM_Interests_STQ2); // 恢复 SVM ST评分 Q2
        if (storedSVM_Interests_AIQ1) setSVM_Interests_AIQ1(storedSVM_Interests_AIQ1); // 恢复 SVM AI评分 Q1
        if (storedSVM_Interests_AIQ2) setSVM_Interests_AIQ2(storedSVM_Interests_AIQ2); // 恢复 SVM AI评分 Q2
        if (storedChatbotResponseInterestsQ1) setChatbotResponseInterestsQ1(storedChatbotResponseInterestsQ1);
        if (storedChatbotResponseInterestsQ2) setChatbotResponseInterestsQ2(storedChatbotResponseInterestsQ2);

        // const savedInterests = localStorage.getItem('Interests');
        
        // // 如果 localStorage 中没有 PersonalInfo，则创建一个空的 PersonalInfo 对象并保存到 localStorage
        // if (!savedInterests) {
        //     const initialInterests = {
        //         Q1: "",
        //         Q2: "",
        //     };
        //     localStorage.setItem('Interests', JSON.stringify(initialInterests));
        // } else {
        //     // 如果 localStorage 中有 PersonalInfo，解析并更新 state
        //     const parsedInterests = JSON.parse(savedInterests);
        //     setInterestsQ1(parsedInterests.Q1 || "");
        //     setInterestsQ2(parsedInterests.Q2 || "");
        //     // setEmail(parsedInterests.email || "");
        //     // setLinkedIn(parsedInterests.linkedin || "");
        // }

        // 还可以设置显示状态
        setShowInterestsResult1(!!storedSVM_Interests_STQ1);
        setShowInterestsResult2(!!storedSVM_Interests_STQ2);
    }, []);
    

    const sendToAI = async (interests, localStorageKey, setResponseState) => {
        const requestPayload = {
            messages: [
                {
                    role: "system",
                    content: `What you are: You are a master in writting CV. Please optimize the user's answer based on the questions in the message. 
                    My requirement is : Optimize the answer more suitable for writing in CV.
                    Format is: If the content of your answer includes multiple skills, use the bullpoint format to separate them, one skill per line. Return only the optimized answer without any introduction or extra explanations.And don't put “” before or after your reply.`
                },
                {
                    role: "user",
                    content: JSON.stringify(interests)
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
                body: new URLSearchParams({ 'content': content, "input_type": "interests"})
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
        const interestsQ1Data  = { "List a few current personal interests that are unique to you and why you do them.": interestsQ1 };
    
        // 将 Q1 的个人声明存储到 localStorage
        localStorage.setItem('showInterestsResult1', JSON.stringify(interestsQ1Data ));
    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(interestsQ1, setSVM_Interests_STQ1, 'SVM Interests STQ1');
    
        // 优化 Q1，将结果发送到 AI
        await sendToAI(interestsQ1Data , 'chatbotResponseInterestsQ1', setChatbotResponseInterestsQ1);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ1 = localStorage.getItem('chatbotResponseInterestsQ1');
        await sendToSVM(AIToSVMQ1, setSVM_Interests_AIQ1, 'SVM Interests AIQ1');
    
        // 更新状态以触发页面重新渲染
        setShowInterestsResult1(true);
    };

    const handleOptimizationQ2 = async () => {
        const interestsQ2Data = { "How do they affect your personal development?": interestsQ2 };
    
        // 将 Q2 的个人声明存储到 localStorage
        localStorage.setItem('showInterestsResult2', JSON.stringify(interestsQ2Data));
    
        // 发送用户输入到 SVM，得到原始输入的评分
        await sendToSVM(interestsQ2, setSVM_Interests_STQ2, 'SVM Interests STQ2');
    
        // 优化 Q2，将结果发送到 AI
        await sendToAI(interestsQ2Data, 'chatbotResponseInterestsQ2', setChatbotResponseInterestsQ2);
    
        // 使用 AI 的回答再次发送到 SVM 进行评分
        const AIToSVMQ2 = localStorage.getItem('chatbotResponseInterestsQ2');
        await sendToSVM(AIToSVMQ2, setSVM_Interests_AIQ2, 'SVM Interests AIQ2');
    
        // 更新状态以触发页面重新渲染
        setShowInterestsResult2(true);
    };
    
    // Q1: 将 AI 生成的答案复制到 Q1 的 textarea 中
    const copyAIAnswerToQ1 = () => {
        setInterestsQ1(chatbotResponseInterestsQ1);  // 将 AI 生成的答案复制到 Q1 的文本框中
        localStorage.setItem('Interests1', chatbotResponseInterestsQ1);
    };

    // Q2: 将 AI 生成的答案复制到 Q2 的 textarea 中
    const copyAIAnswerToQ2 = () => {
        setInterestsQ2(chatbotResponseInterestsQ2);  // 将 AI 生成的答案复制到 Q2 的文本框中
        localStorage.setItem('Interests2', chatbotResponseInterestsQ2);
    };

    const saveUserAnswerToLocalStorageQ1 = () => {        
        const interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
        interests.Q1 = interestsQ1
        localStorage.setItem('Interests', JSON.stringify(interests));

        alert("Your answers have been saved to your CV.");
    };
    
    const saveUserAnswerToLocalStorageQ2 = () => {
        const interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
        interests.Q2 = interestsQ2
        localStorage.setItem('Interests', JSON.stringify(interests));
        alert("Your answers have been saved to your CV.");
    };

    const chooseAIAnswerForQ1 = () => {
        // 先从 localStorage 获取当前的 PersonalStatement，如果不存在则创建一个空对象
        const interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
    
        // 将 AI 生成的回答保存到 Q1 中
        interests.Q1 = chatbotResponseInterestsQ1;
    
        // 将更新后的对象保存回 localStorage
        localStorage.setItem('Interests', JSON.stringify(interests));
    
        alert("AI answer has been saved to your CV.");
    };

    const chooseAIAnswerForQ2 = () => {
        const interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
        interests.Q2 = chatbotResponseInterestsQ2;
        localStorage.setItem('Interests', JSON.stringify(interests));    
        alert("AI answer for Q2 has been saved to your CV.");
    };

    const linkStyle = {
        color: '#007BFF',
        textDecoration: 'none',
        fontWeight: 'bold',
    };
    
    const submitHandler = async () => {
        
        const csrftoken = getCookie('csrftoken'); // 从cookie中获取CSRF token
        const personalinfo = localStorage.getItem('PersonalInfo');
        const personalstatement = localStorage.getItem('PersonalStatement');
        const skills = localStorage.getItem('Skills');
        const interests = localStorage.getItem('Interests');
        const education = localStorage.getItem('Education_temp');
        const work = localStorage.getItem('Work_temp');
        
        // fetch('http://127.0.0.1:8000/api/generate-word/', {
        fetch('http://172.25.0.210:8000/api/generate-word/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,  // 获取 Django 的 CSRF Token
            },
            body: JSON.stringify({
                "PersonalInfo": personalinfo,
                'PersonalStatement':personalstatement,
                'Interests':interests,
                'Skills':skills,
                'Education':education,
                'Work':work
            })
        })
        .then(response => response.blob())
        .then(blob => {
            // 创建下载链接
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'myCV.docx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };


    // const submitHandler = () => {
    //     navigate('/work');  // 跳转到下一步
    // };

    
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

    const containerStyle = {
        display: 'flex',           // 使内容在一行中排列
        justifyContent: 'center',   // 水平居中对齐
        alignItems: 'center',       // 垂直居中对齐
        gap: '10px'                 // p 和 div 之间的间距
      };

    const info = `· Add 3-4 interests to demonstrate work-life balance.\n
· Add some volunteer work – giving back is important for organisations.\n
· Try and avoid generic interests like family, Netflix, travel.\n
· If nothing springs to mind – take up a new hobby!`

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={containerStyle}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>Interests</h1>
            
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
                <p style={questionTitleStyle}>List a few current personal interests that are unique to you and why you do them.(Example: Play video games online.) </p>
                <textarea
                    placeholder="Describe your interests and hobbies..."
                    value={interestsQ1}
                    onChange={(e) => {
                        setInterestsQ1(e.target.value);
                        let interests = JSON.parse(localStorage.getItem('Interests')) || { Q1: "", Q2: "" };
                        interests.Q1 = e.target.value;
                        localStorage.setItem('Interests', JSON.stringify(interests));
                        localStorage.setItem('Interests1', e.target.value); // 保存到 localStorage
                        // localStorage.setItem('Interests', e.target.value);
                        // Interests.Q1 = e.target.value;
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <div>
                        {showInterestsResult1 && (SVM_Interests_STQ1 === "Poor" || SVM_Interests_STQ1 === "Average") && (
                            <p style={answerResultStyle}>
                                Your answer is rated as
                                <span style={{ 
                                    color: SVM_Interests_STQ1 === "Poor" ? 'red' : SVM_Interests_STQ1 === "Average" ? 'orange' : 'black' 
                                }}>
                                    {' '+SVM_Interests_STQ1}
                                </span>.
                                Hover over the yellow icon next to title to see helpful tips on how to write this section effectively.
                            </p>
                        )}

                        {showInterestsResult1 && SVM_Interests_STQ1 === "Excellent" && (
                            <p style={answerResultStyle}>
                                Your answer is rated as 
                                <span style={{ color: 'green' }}>
                                    {' '+SVM_Interests_STQ1}
                                </span>.
                            </p>
                        )}
                    </div>
                    
                    
                    {/* <p style={{ ...answerResultStyle, display: showInterestsResult1 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Interests_STQ1}.
                    </p> */}
                    <button
                        onClick={() => handleOptimizationQ1(interestsQ1, setShowInterestsResult1, setSVM_Interests_STQ1, setSVM_Interests_AIQ1, 'chatbotResponseInterestsQ1', 'showInterestsResult1', 'SVM Interests STQ1', 'SVM Interests AIQ1')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>

                {showInterestsResult1 && (
                    <>
                        <p style={answerResultStyle}>AI answer:</p>                              
                        <p>{chatbotResponseInterestsQ1}</p>



                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Interests_AIQ1}.</p>
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
                <p style={questionTitleStyle}>2. How do they affect your personal development?</p>
                <textarea
                    placeholder="How have your interests contributed to your personal development?"
                    value={interestsQ2}
                    onChange={(e) => {
                        setInterestsQ2(e.target.value);
                        localStorage.setItem('Interests2', e.target.value); // 保存到 localStorage
                    }}
                    rows={4}
                    style={textareaStyle}
                />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                    <p style={{ ...answerResultStyle, display: showInterestsResult2 ? 'block' : 'none' }}>
                        Your answer is rated as {SVM_Interests_STQ2}.
                    </p>
                    <button
                        onClick={() => handleOptimizationQ2(interestsQ2, setShowInterestsResult2, setSVM_Interests_STQ2, setSVM_Interests_AIQ2, 'chatbotResponseInterestsQ2', 'showInterestsResult2', 'SVM Interests STQ2', 'SVM Interests AIQ2')}
                        style={buttonStyleGreen}
                    >
                        Optimize Your Answer
                    </button>
                </div>


                {showInterestsResult2 && (
                    <>
                        <p style={answerResultStyle}>AI answer: {chatbotResponseInterestsQ2}</p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={answerResultStyle}>AI answer is rated as {SVM_Interests_AIQ2}.</p>
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
            <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={buttonStyleBlue} onClick={submitHandler}>Submit</button>
                    <button style={buttonStyleGreen} onClick={() => window.location.href = 'https://forms.office.com/r/P2qPkYTpaF'}>Survey Link</button>
                    {/* <a href="https://forms.office.com/r/P2qPkYTpaF" style={linkStyle}>Survey Link</a> */}
            </div>
        </div>


    );
}

export default Interests;