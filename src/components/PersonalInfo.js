import React, {useState} from 'react';

function PersonalInfo(props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");

    const nameHandler = (event) => {
        setName(event.target.value);
    }

    const phoneHandler = (event) => {
        setPhone(event.target.value);
    }

    return (
        <div>
            <h1>Personal Info</h1>
            <p>Name: <input placeholder={'Name'} type={'text'} value={name} onChange={nameHandler}/></p>
            <p>Phone: <input placeholder={'Phone'} type={'text'} value={phone} onChange={phoneHandler}/></p>
            <button>Submit</button>
        </div>
    );
}

export default PersonalInfo;