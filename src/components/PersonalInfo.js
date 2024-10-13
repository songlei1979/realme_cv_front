// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GlobalStateContext } from '../GlobalStateContext';

// function PersonalInfo(props) {
//     const { updateFormData } = useContext(GlobalStateContext);

//     const [name, setName] = useState("");
//     const [phone, setPhone] = useState("");
//     const [email, setEmail] = useState("");
//     const [linkedIn, setLinkedIn] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {

//         const savedInput = localStorage.getItem('name');
//         if (savedInput) {
//             setName(savedInput);
//         }

//         // 获取 temp_id
//         const fetchTempID = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/generate-temp-id/');
//                 if (response.ok) {
//                     const data = await response.json();
//                     updateFormData('temp_id', data.temp_id);  // 保存到全局状态中
//                 } else {
//                     throw new Error('Failed to generate temp_id');
//                 }
//             } catch (error) {
//                 console.error('Error fetching temp_id:', error);
//             }
//         };

//         fetchTempID();
//     }, []);

//     // 处理输入框的变化
//     const handleInputChange = (e) => {
//         setName(e.target.value);
//         localStorage.setItem('name', e.target.value);  // 每次输入时存入 localStorage
//     };
    
//     const handleSubmit = () => {
//         // updateFormData('personal_info', { name, phone, email, linkedIn });
//         localStorage.setItem('personal_info', { "name":name, "phone":phone, "email":email, "linkedIn":linkedIn });
//         navigate('/statement');
//     };




//     const inputStyle = {
//         padding: '10px',
//         margin: '10px 0',
//         width: 'calc(100% - 22px)', 
//         boxSizing: 'border-box'
//     };

//     const nameHandler = (event) => setName(event.target.value);
//     const phoneHandler = (event) => setPhone(event.target.value);
//     const emailHandler = (event) => setEmail(event.target.value);
//     const linkedInHandler = (event) => setLinkedIn(event.target.value);

//     return (
//         <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
//             <h1 style={{ textAlign: 'center' }}>Personal Info</h1>
//             <div style={{ marginBottom: '15px' }}>
//                 <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
//                 <input
//                     id="name"
//                     placeholder='Name'
//                     type='text'
//                     value={name}
//                     onChange={nameHandler}
//                     style={inputStyle}
//                 />
//             </div>
//             <div style={{ marginBottom: '15px' }}>
//                 <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
//                 <input
//                     id="phone"
//                     placeholder='Phone'
//                     type='text'
//                     value={phone}
//                     onChange={phoneHandler}
//                     style={inputStyle}
//                 />
//             </div>
//             <div style={{ marginBottom: '15px' }}>
//                 <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
//                 <input
//                     id="email"
//                     placeholder='Email'
//                     type='text'
//                     value={email}
//                     onChange={emailHandler}
//                     style={inputStyle}
//                 />
//             </div>
//             <div style={{ marginBottom: '15px' }}>
//                 <label htmlFor="linkedIn" style={{ display: 'block', marginBottom: '5px' }}>LinkedIn:</label>
//                 <input
//                     id="linkedIn"
//                     placeholder='LinkedIn'
//                     type='text'
//                     value={linkedIn}
//                     onChange={linkedInHandler}
//                     style={inputStyle}
//                 />
//             </div>
//             <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>Next</button>
//         </div>    
//     );
// }

// export default PersonalInfo;



import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalStateContext } from '../GlobalStateContext';

function PersonalInfo(props) {
    const { updateFormData } = useContext(GlobalStateContext);

    const [tempId, setTempId] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedName = localStorage.getItem('name');
        const savedPhone = localStorage.getItem('phone');
        const savedEmail = localStorage.getItem('email');
        const savedLinkedIn = localStorage.getItem('linkedIn');
        const savedTempId = localStorage.getItem('temp_id');

        // 恢复输入框中的值
        if (savedName) setName(savedName);
        if (savedPhone) setPhone(savedPhone);
        if (savedEmail) setEmail(savedEmail);
        if (savedLinkedIn) setLinkedIn(savedLinkedIn);

        // 如果 temp_id 不存在则生成并存储
        if (!savedTempId) {
            const generateTempId = () => `temp_${Date.now()}`; // 使用时间戳生成唯一的 temp_id
            const newTempId = generateTempId();
            setTempId(newTempId);
            localStorage.setItem('temp_id', newTempId); // 存储到 localStorage
            updateFormData('temp_id', newTempId);  // 更新全局状态
        } else {
            setTempId(savedTempId);  // 从 localStorage 恢复 temp_id
        }
    }, [updateFormData]);

    // 处理输入框的变化并保存到 localStorage
    const handleInputChange = (setter, key, value) => {
        setter(value);
        localStorage.setItem(key, value);  // 每次输入时存入 localStorage
    };

    // const handleSubmit = () => {
    //     // 将所有信息存入 localStorage
    //     const personalInfo = {
    //         temp_id: tempId,
    //         name: name,
    //         phone: phone,
    //         email: email,
    //         linkedin: linkedIn,
    //     };
    //     localStorage.setItem('PersonalInfo', JSON.stringify(personalInfo));

    //     // 导航到下一个页面
    //     navigate('/statement');
    // };
    const handleSubmit = () => {
        // 将所有信息存入 localStorage
        const personalInfo = {
            temp_id: tempId,
            name: name,
            phone: phone,
            email: email,
            linkedin: linkedIn,
        };
        localStorage.setItem('PersonalInfo', JSON.stringify(personalInfo));

        // 导航到下一个页面
        navigate('/interest');
    };


    const inputStyle = {
        padding: '10px',
        margin: '10px 0',
        width: 'calc(100% - 22px)',
        boxSizing: 'border-box'
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
    
    // 卡片样式
    const cardStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center' }}>Personal Info</h1>


            <div style={cardStyle}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                    <input
                        id="name"
                        placeholder='Name'
                        type='text'
                        value={name}
                        onChange={(e) => handleInputChange(setName, 'name', e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
                    <input
                        id="phone"
                        placeholder='Phone'
                        type='text'
                        value={phone}
                        onChange={(e) => handleInputChange(setPhone, 'phone', e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        id="email"
                        placeholder='Email'
                        type='text'
                        value={email}
                        onChange={(e) => handleInputChange(setEmail, 'email', e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="linkedIn" style={{ display: 'block', marginBottom: '5px' }}>LinkedIn:</label>
                    <input
                        id="linkedIn"
                        placeholder='LinkedIn'
                        type='text'
                        value={linkedIn}
                        onChange={(e) => handleInputChange(setLinkedIn, 'linkedIn', e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <button onClick={handleSubmit} style={buttonStyleBlue}>Next Page</button>
            </div>
        
        </div>
    );
}

export default PersonalInfo;
