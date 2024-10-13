import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from './utils'; // 假设 getCookie 函数存储在 utils.js 文件中
import '../App.css';

function Work(props) {
    const navigate = useNavigate();

    // 初始化  状态，确保它总是一个数组
    const [work, setWork] = useState(() => {
        const savedWork = JSON.parse(localStorage.getItem('Work_temp'));
        return savedWork && Array.isArray(savedWork.work)
            ? savedWork.work
            : [{ job_title: '', organisation: '', startTime: '', endTime: '', tasks: '',achievements:'' }];
    });

    const [SVM_Rate_AIQ, setSVM_Rate_AIQ] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Work_temp')) || {};
        return savedTemp.SVM_Rate_AIQ || {};
    });

    const [SVM_Rate_STQ, setSVM_Rate_STQ] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Work_temp')) || {};
        return savedTemp.SVM_Rate_STQ || {};
    });

    const [chatbotResponseWork, setChatbotResponseWork] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Work_temp')) || {};
        return savedTemp.chatbotResponseWork || {};
    });

    const [showWorkResult, setShowWorkResult] = useState(() => {
        const savedTemp = JSON.parse(localStorage.getItem('Work_temp')) || {};
        return savedTemp.showWorkResult || {};
    });
    
    const [showTooltip, setShowTooltip] = useState(false);

    // 每次状态变化时，将数据保存到 localStorage
    useEffect(() => {
        const tempData = {
            work: work,
            SVM_Rate_AIQ,
            SVM_Rate_STQ,
            chatbotResponseWork: chatbotResponseWork,
            showWorkResult: showWorkResult
        };
        localStorage.setItem('Work_temp', JSON.stringify(tempData));
    }, [work, SVM_Rate_AIQ, SVM_Rate_STQ, chatbotResponseWork, showWorkResult]);

    // const handleSubmit = () => {
    //     navigate('/interest');  // 跳转到下一步
    // };

    const handleSubmit = () => {
        navigate('/education');  // 跳转到下一步
    };

    const handleChange = (index, event) => {
        const newWork = [...work];
        newWork[index][event.target.name] = event.target.value;
        setWork(newWork);
    };

    const addWork = () => {
        setWork([...work, { job_title: '', organisation: '', startTime: '', endTime: '', tasks: '',achievements:''  }]);
    };

    const removeWork = (index) => {
        const newWork = [...work];
        newWork.splice(index, 1);
        setWork(newWork);
    };

    // 发送到 AI 进行优化
    const sendToAI = async (work, index) => {
        const requestPayload = {
            messages: [
                {
                    role: "system",
                    content: "You are a master in writting CV. Please optimize the user's answer based on the questions in the message. Make it more suitable for writing in resume. Return only the optimized answer without any introduction or extra explanations.And don't put “” before or after your reply."
                },
                {
                    role: "user",
                    content: JSON.stringify(work)
                }
            ]
        };

        try {
            const response = await fetch('http://10.244.159.50:1234/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.choices && result.choices.length > 0) {
                    const processedAnswer = result.choices[0].message.content;
                    setChatbotResponseWork(prev => ({ ...prev, [index]: processedAnswer }));
                    setShowWorkResult(prev => ({ ...prev, [index]: true }));

                    // 更新 localStorage
                    const tempData = JSON.parse(localStorage.getItem('Work_temp')) || {};
                    tempData.chatbotResponseWork = { ...chatbotResponseWork, [index]: processedAnswer };
                    tempData.showWorkResult = { ...showWorkResult, [index]: true };
                    localStorage.setItem('Work_temp', JSON.stringify(tempData));
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
            const response = await fetch('http://127.0.0.1:8000/api/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrftoken
                },
                body: new URLSearchParams({ 'content': content, 'input_type': 'work' })
            });

            if (response.ok) {
                const data = await response.json();
                setRate(prev => ({ ...prev, [index]: data.predicted_category }));

                // 更新 localStorage
                const tempData = JSON.parse(localStorage.getItem('Work_temp')) || {};
                tempData[localStorageKey] = { ...SVM_Rate_STQ, [index]: data.predicted_category };
                localStorage.setItem('Work_temp', JSON.stringify(tempData));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // 处理优化按钮的点击
    const handleOptimization = async (index) => {
        const work_data = {"Describe your work experience or projects that you've worked on. Try to provide quantifiable results, such as “Helped the department improve productivity by 20% through process optimization." : work[index].achievements};

        // 先通过 SVM 获取评分
        await sendToSVM(work_data.achievements, index, 'SVM_Rate_STQ', setSVM_Rate_STQ);

        // 通过 AI 优化
        await sendToAI(work_data, index);

        // 使用 AI 优化后的结果再次通过 SVM 获取评分
        const AIResponse = chatbotResponseWork[index];
        await sendToSVM(AIResponse, index, 'SVM_Rate_AIQ', setSVM_Rate_AIQ);
    };

    // 将 AI 生成的回答复制到教育经历的 textarea 中
    const copyAIAnswerToEdit = (index) => {
        const updatedWork = [...work];
        updatedWork[index].achievements = chatbotResponseWork[index];
        setWork(updatedWork);
    };

    // 保存用户输入的内容到 CV
    const saveUserAnswerToLocalStorage = (index) => {
        const savedWork = JSON.parse(localStorage.getItem('Work')) || {};

        savedWork[`Work${index + 1}`] = {
            job_title: work[index].job_title,
            organisation: work[index].organisation,
            startTime: work[index].startTime,
            endTime: work[index].endTime,
            achievements: work[index].achievements,
            tasks: work[index].tasks
        };

        // 保存到 localStorage
        localStorage.setItem('Work', JSON.stringify(savedWork));
        alert("Your answers have been saved to your CV.");
    };

    // 保存 AI 生成的内容到 CV
    const chooseAIAnswer = (index) => {
        const savedWork = JSON.parse(localStorage.getItem('Work')) || {};

        savedWork[`Work${index + 1}`] = {
            job_title: work[index].job_title,
            organisation: work[index].organisation,
            startTime: work[index].startTime,
            endTime: work[index].endTime,
            tasks: work[index].tasks,
            achievements: chatbotResponseWork[index] // 使用 AI 生成的 achievements
        };

        // 保存到 localStorage
        localStorage.setItem('Work', JSON.stringify(savedWork));
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
    
    const info = "• State your job titles, the places where you worked and the start and finish dates for each.\n • List the main tasks in the jobs, especially those that relate to the position you are applying for, also include any achievements if you can."


    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <div style={containerStyle}>
            
                <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333', fontSize: '2rem' }}>Work Experience</h1>
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
                {Array.isArray(work) && work.map((item, index) => (
                    <div key={index} style={cardStyle}>
                        {showWorkResult[0] && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {work.length > 1 && (
                                    <>
                                        <button onClick={() => removeWork(index)} style={{...buttonStyleGreen, width: 'auto', padding: '5px 10px'}}> - </button>
                                        <br/><br/>
                                    </>

                                )}
                            </div>
                            
                        )}

                        <div style={rowStyle}>
                            <label style={labelInlineStyle}>Job title</label>
                            <input
                                type="text"
                                name="job_title"
                                placeholder="Job_title"
                                value={item.job_title}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                            <label style={labelInlineStyle}>Institute</label>
                            <input
                                type="text"
                                name="organisation"
                                placeholder="Institute"
                                value={item.organisation}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                        </div>

                        <div style={rowStyle}>
                            <label style={labelInlineStyle}>Start Time</label>
                            <input
                                type="text"
                                name="startTime"
                                placeholder="Start Time"
                                value={item.startTime}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                            <label style={labelInlineStyle}>End Time</label>
                            <input
                                type="text"
                                name="endTime"
                                placeholder="End Time"
                                value={item.endTime}
                                onChange={(event) => handleChange(index, event)}
                                style={inputStyleHalf}
                            />
                        </div>

                        <label style={labelInlineStyle}>Tasks</label>
                            <textarea   
                                type="text"
                                name="tasks"
                                placeholder="Tasks"
                                value={item.tasks}
                                onChange={(event) => handleChange(index, event)}
                                rows={4}
                                style={textareaStyle}
                            />


                        <p style={questionTitleStyle}>Describe your work experience or projects that you've worked on. Try to provide quantifiable results, such as “Helped the department improve productivity by 20% through process optimization".</p>
                        <textarea
                            name="achievements"
                            placeholder="Describe your work experience or projects..."
                            value={item.achievements}
                            onChange={(event) => handleChange(index, event)}
                            rows={4}
                            style={textareaStyle}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                            <p style={{ ...answerResultStyle, display: showWorkResult[index] ? 'block' : 'none' }}>
                                Your answer is rated as {SVM_Rate_STQ[index]}.
                            </p>
                            <button
                                onClick={() => handleOptimization(index)} style={buttonStyleGreen}
                            >
                                Optimize Your Answer
                            </button>
                        </div>

                        {showWorkResult[index] && (
                            <div>
                                <p style={answerResultStyle}>AI answer:</p>                              
                                <p>{chatbotResponseWork[index]}</p>

                                
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
                        )}
                    </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={addWork} style={{...buttonStyleGreen, width: 'auto', padding: '5px 10px'}}>+</button>
                </div>
                <button onClick={handleSubmit} style={buttonStyleBlue}>Next</button>
            </div>
        </div>
    );
}

export default Work;
