import React, { useState, useEffect } from 'react';
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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background-color: #218838;
  }
`;

const LoginLink = styled(Link)`
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

const SuccessMessage = styled.div`
  color: #28a745;
  margin-top: 1rem;
  text-align: center;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const CheckboxLabel = styled.label`
  font-size: 1rem;
  color: #333;
`;

interface SignupProps {
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

interface Family {
  id: string;
  name: string;
  routerId: string;
  signupPassword: string;
  routerIp: string;
  createdAt: string;
}

const Signup: React.FC<SignupProps> = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyPassword, setFamilyPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [families, setFamilies] = useState<Family[]>([]);
  const navigate = useNavigate();

  // Fetch families on component mount
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/families');
        if (!response.ok) {
          throw new Error('Failed to fetch families');
        }
        const data = await response.json();
        setFamilies(data);
      } catch (err) {
        console.error('Error fetching families:', err);
        // Try to load from localStorage as fallback
        const savedFamilies = localStorage.getItem('families');
        if (savedFamilies) {
          setFamilies(JSON.parse(savedFamilies));
        }
      }
    };

    fetchFamilies();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Validate admin key if admin
    if (isAdmin && adminKey !== 'admin123') {
      setError('Invalid admin key');
      return;
    }

    // Get existing users
    const usersMap = JSON.parse(localStorage.getItem('usersMap') || '{}') as UserMap;
    
    // Check if username already exists
    if (usersMap[username]) {
      setError('Username already registered');
      return;
    }

    // For non-admin users, validate family credentials
    if (!isAdmin) {
      // Find family by name
      const family = families.find(f => f.name.toLowerCase() === familyName.toLowerCase());
      
      if (!family) {
        setError('Family name not found');
        return;
      }
      
      // Validate family password
      if (family.signupPassword !== familyPassword) {
        setError('Invalid family password');
        return;
      }
    }

    // Create new user
    const newUser: User = {
      username,
      password,
      familyName: isAdmin ? 'Admin' : familyName,
      isAdmin
    };

    // Save user
    usersMap[username] = newUser;
    localStorage.setItem('usersMap', JSON.stringify(usersMap));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    setSuccess('Registration successful!');
    
    // Redirect after a brief delay to show success message
    setTimeout(() => {
      setIsAuthenticated(true);
      navigate('/home');
    }, 1500);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="adminCheckbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <CheckboxLabel htmlFor="adminCheckbox">Register as Admin</CheckboxLabel>
        </CheckboxContainer>
        
        {isAdmin ? (
          <Input
            type="password"
            placeholder="Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            required
          />
        ) : (
          <>
            <Input
              type="text"
              placeholder="Family Name"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Family Password"
              value={familyPassword}
              onChange={(e) => setFamilyPassword(e.target.value)}
              required
            />
          </>
        )}
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button type="submit">Sign Up</Button>
        <LoginLink to="/login">
          Already have an account? Login
        </LoginLink>
      </Form>
    </Container>
  );
};

export default Signup; 