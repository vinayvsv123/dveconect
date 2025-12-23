import Navbar from './components/Navbar.jsx';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import ExplorePage from './pages/Explore.jsx';
import ProfilePage from './pages/Profile.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import AuthPage from './pages/Auth.jsx';


function App() {
  return (
    
    <BrowserRouter>

      <Navbar/>
    
      <Routes>
        <Route path='/' element={<AuthPage/>}/>
        <Route path='/explore' element={<ExplorePage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/project/:id' element={<ProjectDetailPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;