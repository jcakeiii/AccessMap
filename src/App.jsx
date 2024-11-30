import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar/NavBar';
import Intro from './components/Intro/Intro'
import Footer from './components/Footer/Footer'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <div className="App">
      <NavBar />
      <Intro className="intro-container" />
      <Footer />
    </div>
  )
}

export default App;