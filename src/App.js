
import './App.css';
import { TextField, InputAdornment } from '@mui/material';
import { Phone } from '@mui/icons-material';

function App() {
  return (
    <div className="App">

      <TextField label="Mobile number" variant="filled" 
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Phone />
          </InputAdornment>
        ),
      }}
       />
    </div>
  );
}

export default App;
