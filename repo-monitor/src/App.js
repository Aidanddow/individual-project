
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';
import Repository from './pages/Repository'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Repository />
      </header>

    </div>
  );
}

export default App;
