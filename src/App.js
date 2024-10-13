// import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
// import logo from './logo.svg'; 
// import './App.css';
// import Home from "./components/Home";
// import PersonalInfo from "./components/PersonalInfo";
// import Statement from "./components/Statement";
// import Skills from "./components/Skills";
// import Education from './components/Education';
// import Work from './components/Work';
// import Interests from './components/Interests';

// function App() {

//   return (
//     <div className="App">
//       <Router>
//         <nav>
//           <ul>
//             <li><NavLink to="/">Home</NavLink></li>
//             <li><NavLink to="/personal-info" >Personal Info</NavLink></li>
//             <li><NavLink to="/statement" >Personal Statement</NavLink></li>
//             <li><NavLink to="/skills">Key Skills</NavLink></li>
//             <li><NavLink to="/education">Education</NavLink></li>
//             <li><NavLink to="/work">Work Experience</NavLink></li>
//             <li><NavLink to="/interest">Interests</NavLink></li>
//           </ul>
//         </nav>
//         <div className="content">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/personal-info" element={<PersonalInfo />} />
//             <Route path="/statement" element={<Statement />} />
//             <Route path="/skills" element={<Skills />} />
//             <Route path="/education" element={<Education />} />
//             <Route path="/work" element={<Work />} />
//             <Route path="/interest" element={<Interests />} />
//           </Routes>
//         </div>
//       </Router>
//     </div>
//   );
// }

// export default App;




import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import logo from './logo.svg'; 
import './App.css';
import Home from "./components/Home";
import PersonalInfo from "./components/PersonalInfo";
import Statement from "./components/Statement";
import Skills from "./components/Skills";
import Education from './components/Education';
import Work from './components/Work';
import Interests from './components/Interests';
import { GlobalStateProvider } from './GlobalStateContext'; // 引入GlobalStateProvider

// import './styles.css'; // 引入全局CSS文件

function App() {
  return (
    <div className="App">
      <GlobalStateProvider> {/* 使用GlobalStateProvider包裹整个应用 */}
        <Router>
          <nav className='sidebar'>
            <ul>
              {/* <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/personal-info" >Personal Info</NavLink></li>
              <li><NavLink to="/statement" >Personal Statement</NavLink></li>
              <li><NavLink to="/skills">Key Skills</NavLink></li>
              <li><NavLink to="/education">Education</NavLink></li>
              <li><NavLink to="/work">Work Experience</NavLink></li>
              <li><NavLink to="/interest">Interests</NavLink></li> */}
              
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/personal-info" >Personal Info</NavLink></li>
              <li><NavLink to="/interest">Interests</NavLink></li>
              <li><NavLink to="/work">Work Experience</NavLink></li>
              <li><NavLink to="/education">Education</NavLink></li>
              <li><NavLink to="/skills">Key Skills</NavLink></li>
              <li><NavLink to="/statement" >Personal Statement</NavLink></li>
            </ul>
          </nav>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/statement" element={<Statement />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/education" element={<Education />} />
              <Route path="/work" element={<Work />} />
              <Route path="/interest" element={<Interests />} />
            </Routes>
          </div>
        </Router>
      </GlobalStateProvider>
    </div>
  );
}

export default App;
