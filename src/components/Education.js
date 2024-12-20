import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './utils'; // 假设 getCookie 函数存储在 utils.js 文件中
import '../App.css';

function Education(props) {
    const navigate = useNavigate();

    // 初始化 educations 状态，确保它总是一个数组
    const [educations, setEducations] = useState(() => {
        const savedEducations = JSON.parse(localStorage.getItem('Education_temp'));
        return savedEducations && Array.isArray(savedEducations.educations)
            ? savedEducations.educations
            : [{ major: '', startTime: '', endTime: '', school: '', achievements: '' }];
    });
    // const [educations, setEducations] = useState(() => {
    //     const savedEducations = JSON.parse(localStorage.getItem('Education')) || [{ major: '', startTime: '', endTime: '', school: '', achievements: '' }];
    //     const tempData = JSON.parse(localStorage.getItem('Education_temp')) || savedEducations;
    //     return tempData;
    // });

    const [SVM_Rate_AIQ, setSVM_Rate_AIQ] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Education_temp')) || {};
        return savedTemp.SVM_Rate_AIQ || {};
    });

    const [SVM_Rate_STQ, setSVM_Rate_STQ] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Education_temp')) || {};
        return savedTemp.SVM_Rate_STQ || {};
    });

    const [chatbotResponseEducation, setChatbotResponseEducation] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Education_temp')) || {};
        return savedTemp.chatbotResponseEducation || {};
    });

    const [showEducationResult, setShowEducationResult] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Education_temp')) || {};
        return savedTemp.showEducationResult || {};
    });
    
    const [showTooltip, setShowTooltip] = useState(false);

    // 每次状态变化时，将数据保存到 localStorage
    useEffect(() => {
        

        const tempData = {
            educations,
            SVM_Rate_AIQ,
            SVM_Rate_STQ,
            chatbotResponseEducation,
            showEducationResult
        };
        localStorage.setItem('Education_temp', JSON.stringify(tempData));
    }, [educations, SVM_Rate_AIQ, SVM_Rate_STQ, chatbotResponseEducation, showEducationResult]);

    const handleSubmit = () => {
        navigate('/work');  // 跳转到下一步
    };

    // const handleSubmit = () => {
    //     navigate('/skills');  // 跳转到下一步
    // };

    const handleChange = (index, event) => {
        const newEducations = [...educations];
        newEducations[index][event.target.name] = event.target.value;
        setEducations(newEducations);
    };

    const addEducation = () => {
        setEducations([...educations, { major: '', startTime: '', endTime: '', school: '', achievements: '' }]);
    };

    const removeEducation = (index) => {
        const newEducations = [...educations];
        newEducations.splice(index, 1);
        setEducations(newEducations);
    };

    // 发送到 AI 进行优化
    const sendToAI = async (education, index) => {
        const requestPayload = {
            messages: [
                {
                    role: "system",
                    content: "You are a master in writting CV. Please optimize the user's answer based on the questions in the message. Make it more suitable for writing in resume. Return only the optimized answer without any introduction or extra explanations.And don't put “” before or after your reply."
                },
                {
                    role: "user",
                    content: JSON.stringify(education)
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
                    setChatbotResponseEducation(prev => ({ ...prev, [index]: processedAnswer }));
                    setShowEducationResult(prev => ({ ...prev, [index]: true }));

                    // 更新 localStorage
                    const tempData = JSON.parse(localStorage.getItem('Education_temp')) || {};
                    tempData.chatbotResponseEducation = { ...chatbotResponseEducation, [index]: processedAnswer };
                    tempData.showEducationResult = { ...showEducationResult, [index]: true };
                    localStorage.setItem('Education_temp', JSON.stringify(tempData));
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

    // 发送到 SVM 进行评分
    const sendToSVM = async (content, index, localStorageKey, setRate) => {
        const csrftoken = getCookie('csrftoken');
        try {
            // const response = await fetch('http://127.0.0.1:8000/api/predict/', {
            const response = await fetch('http://172.25.0.210:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken
                },
                body: new URLSearchParams({ 'content': content, 'input_type': 'education' })
            });

            if (response.ok) {
                const data = await response.json();
                setRate(prev => ({ ...prev, [index]: data.predicted_category }));

                // 更新 localStorage
                const tempData = JSON.parse(localStorage.getItem('Education_temp')) || {};
                tempData[localStorageKey] = { ...SVM_Rate_STQ, [index]: data.predicted_category };
                localStorage.setItem('Education_temp', JSON.stringify(tempData));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 处理优化按钮的点击
    const handleOptimization = async (index) => {
        const education = {"Describe your academic achievements or notable projects you've worked on during your studies.":educations[index].achievements};

        // 先通过 SVM 获取评分
        await sendToSVM(education.achievements, index, 'SVM_Rate_STQ', setSVM_Rate_STQ);

        // 通过 AI 优化
        await sendToAI(education, index);

        // 使用 AI 优化后的结果再次通过 SVM 获取评分
        const AIResponse = chatbotResponseEducation[index];
        await sendToSVM(AIResponse, index, 'SVM_Rate_AIQ', setSVM_Rate_AIQ);
    };

    // 将 AI 生成的回答复制到教育经历的 textarea 中
    const copyAIAnswerToEdit = (index) => {
        const updatedEducations = [...educations];
        updatedEducations[index].achievements = chatbotResponseEducation[index];
        setEducations(updatedEducations);
    };

    // 保存用户输入的内容到 CV
    const saveUserAnswerToLocalStorage = (index) => {
        const savedEducation = JSON.parse(localStorage.getItem('Education')) || {};

        savedEducation[`Education${index + 1}`] = {
            major: educations[index].major,
            school: educations[index].school,
            start: educations[index].startTime,
            end: educations[index].endTime,
            achievements: educations[index].achievements
        };

        // 保存到 localStorage
        localStorage.setItem('Education', JSON.stringify(savedEducation));
        alert("Your answers have been saved to your CV.");
    };

    // 保存 AI 生成的内容到 CV
    const chooseAIAnswer = (index) => {
        const savedEducation = JSON.parse(localStorage.getItem('Education')) || {};

        savedEducation[`education${index + 1}`] = {
            major: educations[index].major,
            school: educations[index].school,
            start: educations[index].startTime,
            end: educations[index].endTime,
            achievements: chatbotResponseEducation[index] // 使用 AI 生成的 achievements
        };

        // 保存到 localStorage
        localStorage.setItem('Education', JSON.stringify(savedEducation));
        alert("AI answer has been saved to your CV.");
    };


    const inputStyleHalf = {
        padding: '8px',
        flex: '1 1 48%', 
        margin: '0 1%',  
        boxSizing: 'border-box'
    };
        
    // 鼠标悬停
    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
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


    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',  // 行之间的间距
    };
    
    
    
    
    const questionTitleStyle = {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    };
    
    
    const labelInlineStyle = {
        width: '120px',  // 确保标签宽度一致
        marginRight: '10px',
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',  // 右对齐标签
    };
    
    
    const textareaStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        resize: 'vertical',
        boxSizing: 'border-box',
        marginRight: '10px', // 使textarea不紧贴边缘
    };
    
    const containerStyle = {
        display: 'flex',           // 使内容在一行中排列
        justifyContent: 'center',   // 水平居中对齐
        alignItems: 'center',       // 垂直居中对齐
        gap: '10px'                 // p 和 div 之间的间距
      };

    const info = `· Newest qualification first.\n
· Only include qualifications that will get you the job.\n
· Only include your highest level of NCEA if it will get you the job.\n
· Briefly list course projects here that relate directly to the role.`

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            
            <div style={containerStyle}>

                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>Education</h1>
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
            <div >
                {Array.isArray(educations) && educations.map((item, index) => (
                    <div key={index} style={cardStyle}>
                        {showEducationResult[0] && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {educations.length > 1 && (
                                    <>
                                        <button onClick={() => removeEducation(index)} style={{...buttonStyleGreen, width: 'auto', padding: '5px 10px'}}> - </button>
                                        <br/><br/>
                                    </>

                                )}
                            </div>
                            
                        )}

                        <div style={rowStyle}>
                            <label style={labelInlineStyle}>Qualification</label>
                            <input
                                type="text"
                                name="major"
                                placeholder="Qualification"
                                value={item.major}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                            <label style={labelInlineStyle}>Institute</label>
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
                            <label style={labelInlineStyle}>Start Date</label>
                            <input
                                type="text"
                                name="startTime"
                                placeholder="Start Date"
                                value={item.startTime}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                            <label style={labelInlineStyle}>End Date</label>
                            <input
                                type="text"
                                name="endTime"
                                placeholder="End Date"
                                value={item.endTime}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                        </div>

                        <p style={questionTitleStyle}>List some courses, projects relevant to the job you want to apply. </p>
                        <textarea
                            name="achievements"
                            placeholder="List some courses, projects..."
                            value={item.achievements}
                            onChange={(event) => handleChange(index, event)}
                            rows={4}
                            style={textareaStyle}
                        />

                        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={{ ...answerResultStyle, display: showEducationResult[index] ? 'block' : 'none' }}>
                                Your answer is rated as {SVM_Rate_STQ[index]}.
                            </p>
                            <button
                                onClick={() => handleOptimization(index)} style={buttonStyleGreen}
                            >
                                Optimize Your Answer
                            </button>
                        </div>

                        {showEducationResult[index] && (
                            <div>
                                <p style={answerResultStyle}>AI answer:</p>                              
                                <p>{chatbotResponseEducation[index]}</p>

                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                                    <p style={{ display: 'grid', justifyItems: 'end' }}>AI answer is rated as {SVM_Rate_AIQ[index]}. </p>
                                    <button onClick={() => copyAIAnswerToEdit(index)} style={buttonStyleGreen}>Copy AI Answer to Edit</button>
                                </div>
                                <br/><br/>
                                <div style={buttonContainerStyle}>
                                    <button onClick={() => saveUserAnswerToLocalStorage(index)} style={buttonStyleBlue}>Choose my answer to the CV</button>
                                    <button onClick={() => chooseAIAnswer(index)} style={buttonStyleBlue}>Choose AI answer to the CV</button>
                                </div>
                            </div>
                        )} */}
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={addEducation} style={{...buttonStyleGreen, width: 'auto', padding: '5px 10px'}}>+</button>
                </div>
                <button onClick={handleSubmit} style={buttonStyleBlue}>Next Page</button>
            </div>
        </div>
    );
}

export default Education;
