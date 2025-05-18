import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const Form = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const SignupLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #007bff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
`;

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface User {
  username: string;
  password: string;
  familyName: string;
  isAdmin: boolean;
}

interface UserMap {
  [username: string]: User;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check for hardcoded admin credentials
    if (username === 'admin' && password === '1234') {
      // Create an admin user object
      const adminUser: User = {
        username: 'admin',
        password: '1234',
        familyName: 'Admin',
        isAdmin: true
      };

      // Set authentication and save admin user
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      
      // Get existing users map
      const usersMap = JSON.parse(localStorage.getItem('usersMap') || '{}') as UserMap;
      
      // Add admin user to users map if not already there
      if (!usersMap['admin']) {
        usersMap['admin'] = adminUser;
        localStorage.setItem('usersMap', JSON.stringify(usersMap));
      }
      
      navigate('/home');
      return;
    }

    // Get users from localStorage
    const usersMap = JSON.parse(localStorage.getItem('usersMap') || '{}') as UserMap;
    
    // Find user with matching username and password
    const user = usersMap[username];

    if (user && user.password === password) {
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit">Login</Button>
        <SignupLink to="/signup">
          Don't have an account? Sign up
        </SignupLink>
      </Form>
    </Container>
  );
};

export default Login; 