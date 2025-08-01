import ReactDOM from 'react-dom/client';
import App from './App';
import CustomCursor from './components/CustomCursor.jsx';
import './styles/index.css';
import './styles/theory.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <CustomCursor />
    <App />
  </>
);