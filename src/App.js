import logo from './logo.svg';
import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import Home from "./components/Home";
import PersonalInfo from "./components/PersonalInfo";

function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/personal-info">Personal Info</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
        </Routes>
      </div>
    </Router>
    </div>
  );
}

export default App;
