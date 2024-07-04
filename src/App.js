import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home"
import LogIn from "./pages/login"
import Reg from "./pages/register"
import Upload from "./pages/upload"
import Profile from "./pages/profile"
import Project from "./pages/project"

import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<LogIn />} />
        <Route exact path='/register' element={<Reg />} />
        <Route exact path='/upload' element={<Upload />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route exact path='/project' element={<Project />} />
      </Routes>
    </Router>
  );
}

export default App;


