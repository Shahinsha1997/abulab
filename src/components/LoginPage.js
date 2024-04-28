import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (this.state.username === 'admin' && this.state.password === '123') {
      this.setState({ error: null });
      localStorage.setItem('isLoggedIn','true');
      this.props.handleNavigate('/dashboard');// Redirect to dashboard
    } else {
      this.setState({ error: 'Invalid username or password' });
    }
    return;
    // Add logic to handle login with username and password (we'll cover this later)
    try {
      // Simulate API call (replace with actual login logic)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        // Login successful - redirect to App Detail View Page (implementation later)
        this.props.history.push('/dashboard')
      } else {
        const errorData = await response.json(); // Parse error message from response
        this.setState({ error: errorData.message || 'Login failed.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      this.setState({ error: 'An error occurred. Please try again later.' });
    }
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <div className="login-page" style={{ backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}> {/* Added background color, flexbox for centering, and minimum height */}
        <div style={{ padding: 20, borderRadius: 5, backgroundColor: 'white', maxWidth: 400 }}> {/* Added padding, rounded corners, and max-width for form container */}
          <Typography variant="h5" style={{ marginBottom: 20 }}>Login</Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={username}
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
              required
              style={{ borderColor: '#ccc', borderRadius: 4 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
              required
              style={{ borderColor: '#ccc', borderRadius: 4 }}
            />
            <Button variant="contained" type="submit" color="primary" style={{ marginTop: 15 }}>
              Login
            </Button>
          </form>
          {error && <Alert severity="error">{error}</Alert>}
        </div>
      </div>
    );
  }
}

export default LoginPage;
