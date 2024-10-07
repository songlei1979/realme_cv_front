import React, { useState, useContext } from 'react'; // 增加 useContext 的引入
import { GlobalStateContext } from '../GlobalStateContext';

function Interests(props) {
    const { formData, updateFormData } = useContext(GlobalStateContext); // 使用 useContext 获取全局状态
    const [interestQ1, setInterestQ1] = useState(formData.interests?.interestQ1 || ""); // 初始化时从上下文中获取数据
    const [interestQ2, setInterestQ2] = useState(formData.interests?.interestQ2 || ""); // 初始化时从上下文中获取数据

    const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: 'auto',
        textAlign: 'left'
    };

    const textareaStyle = {
        width: '100%', 
        padding: '10px',
        margin: '10px 0',
        boxSizing: 'border-box', 
        minHeight: '150px' 
    };

    const buttonStyle = {
        display: 'block', 
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        margin: '20px auto',
        fontSize: '16px'
    };

    const interestQ1Handler = (event) => {
        setInterestQ1(event.target.value);
    };

    const interestQ2Handler = (event) => {
        setInterestQ2(event.target.value);
    };



    const submitHandler = async () => {
        // 更新全局状态中的 interests 数据
        updateFormData('interests', [
            { content: `Q1: ${interestQ1}\nQ2: ${interestQ2}` }
        ]);

        // 组合所有的数据提交到后端
        const data = {
            ...formData, // 从上下文中获取所有数据
            temp_id: formData.temp_id,
            interests: { interestQ1, interestQ2 } // 确保 interests 是最新的
        };

        try {
            // 打印发送的数据，确保其格式是正确的对象
            console.log('Data to be sent:', data);
        
            // 确保 data 是一个字典对象并且不为空
            if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                throw new Error('Invalid data format: data must be a non-null object');
            }
        
            // 发送请求
            const response = await fetch('http://localhost:8000/api/submit-info/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // 确保内容类型为 JSON
                },
                body: JSON.stringify(data),  // 将对象转换为 JSON 字符串
            });
        
            if (!response.ok) {
                // 在响应不成功时抛出错误
                throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
            }
        
            // 处理返回的 JSON 响应
            const result = await response.json();
            console.log('Success:', result);
            alert("Data submitted successfully!");
        } catch (error) {
            // 捕捉到任何错误时的处理逻辑
            console.error('Error:', error);
            alert("Failed to submit data. Please try again later.");
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: 'center' }}>Interests</h1>
            <p>1. What hobbies or activities are you involved in?</p>
            <textarea
                placeholder="Describe your interests and hobbies..."
                value={interestQ1}
                onChange={interestQ1Handler}
                style={textareaStyle}
            />
            <p>2. How do they affect your personal development? For example, did team sports improve your teamwork?</p>
            <textarea
                placeholder="How have your interests contributed to your personal development?"
                value={interestQ2}
                onChange={interestQ2Handler}
                style={textareaStyle}
            />
            <button style={buttonStyle} onClick={submitHandler}>Submit</button>
        </div>
    );
}

export default Interests;




