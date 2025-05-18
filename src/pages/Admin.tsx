import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableContainer, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const AdminContainer = styled(Box)`
  padding: 24px;
`;

const AdminPaper = styled(Paper)`
  padding: 20px;
  margin-top: 20px;
`;

interface AdminProps {
  darkMode: boolean;
}

interface Family {
  id: string;              // Unique identifier
  name: string;            // Example: "Atzmon"
  routerId: string;        // Router ID (Example: "beryl-3")
  signupPassword: string;  // Password needed to join this family
  routerIp: string;        // Family router IP address (192.168.x.x)
  createdAt: string;       // Creation date
}

const Admin: React.FC<AdminProps> = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentFamily, setCurrentFamily] = useState<Family>({
    id: '',
    name: '',
    routerId: '',
    signupPassword: '',
    routerIp: '',
    createdAt: ''
  });

  // Load families from server API on component mount
  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/families');
      if (!response.ok) {
        throw new Error('Failed to fetch families');
      }
      const data = await response.json();
      setFamilies(data);
      setError('');
    } catch (err) {
      console.error('Error fetching families:', err);
      setError('Failed to load families. Please try again.');
      // Try to load from localStorage as a fallback
      const savedFamilies = localStorage.getItem('families');
      if (savedFamilies) {
        setFamilies(JSON.parse(savedFamilies));
      }
    } finally {
      setLoading(false);
    }
  };

  // Save families to server API
  const saveFamiliesToServer = async (updatedFamilies: Family[]) => {
    try {
      const response = await fetch('http://localhost:5000/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFamilies),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save families');
      }
      
      // Also save to localStorage as backup
      localStorage.setItem('families', JSON.stringify(updatedFamilies));
      
      setSuccessMessage('Families saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving families:', err);
      setError('Failed to save families. Please try again.');
      setTimeout(() => setError(''), 3000);
      
      // Still save to localStorage
      localStorage.setItem('families', JSON.stringify(updatedFamilies));
    }
  };

  const handleOpenDialog = (family?: Family) => {
    if (family) {
      setCurrentFamily(family);
      setEditMode(true);
    } else {
      setCurrentFamily({
        id: Date.now().toString(),
        name: '',
        routerId: '',
        signupPassword: '',
        routerIp: '',
        createdAt: new Date().toISOString()
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentFamily(prevFamily => ({
      ...prevFamily,
      [name]: value
    }));
  };

  const handleSaveFamily = () => {
    let updatedFamilies: Family[];
    
    if (editMode) {
      // Update existing family
      updatedFamilies = families.map(family => 
        family.id === currentFamily.id ? currentFamily : family
      );
    } else {
      // Add new family
      updatedFamilies = [...families, currentFamily];
    }
    
    setFamilies(updatedFamilies);
    saveFamiliesToServer(updatedFamilies);
    handleCloseDialog();
  };

  const handleDeleteFamily = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this family?')) {
      try {
        // First delete from server
        const response = await fetch(`http://localhost:5000/api/families/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete family');
        }
        
        // Then update local state
        const updatedFamilies = families.filter(family => family.id !== id);
        setFamilies(updatedFamilies);
        localStorage.setItem('families', JSON.stringify(updatedFamilies));
        
        setSuccessMessage('Family deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting family:', err);
        setError('Failed to delete family. Please try again.');
        setTimeout(() => setError(''), 3000);
        
        // Still update local state
        const updatedFamilies = families.filter(family => family.id !== id);
        setFamilies(updatedFamilies);
        localStorage.setItem('families', JSON.stringify(updatedFamilies));
      }
    }
  };

  return (
    <AdminContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary">
          Family Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </Box>
      
      <AdminPaper>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Families Table
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New Family
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Family Name</TableCell>
                <TableCell>Router ID</TableCell>
                <TableCell>Router IP</TableCell>
                <TableCell>Signup Password</TableCell>
                <TableCell>Creation Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading families...
                  </TableCell>
                </TableRow>
              ) : families.length > 0 ? (
                families.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell>{family.name}</TableCell>
                    <TableCell>{family.routerId}</TableCell>
                    <TableCell>{family.routerIp}</TableCell>
                    <TableCell>{family.signupPassword}</TableCell>
                    <TableCell>{new Date(family.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenDialog(family)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteFamily(family.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No families to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </AdminPaper>

      {/* Dialog for adding/editing family */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Family' : 'Add New Family'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              name="name"
              label="Family Name"
              fullWidth
              value={currentFamily.name}
              onChange={handleInputChange}
              placeholder="Example: Atzmon"
              required
            />
            <TextField
              name="routerId"
              label="Router ID"
              fullWidth
              value={currentFamily.routerId}
              onChange={handleInputChange}
              placeholder="Example: beryl-3"
              required
            />
            <TextField
              name="signupPassword"
              label="Signup Password"
              fullWidth
              value={currentFamily.signupPassword}
              onChange={handleInputChange}
              placeholder="Example: AZ1234"
              required
            />
            <TextField
              name="routerIp"
              label="Router IP"
              fullWidth
              value={currentFamily.routerIp}
              onChange={handleInputChange}
              placeholder="Example: 192.168.10.1"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveFamily} 
            variant="contained" 
            color="primary"
            disabled={!currentFamily.name || !currentFamily.routerId || !currentFamily.signupPassword || !currentFamily.routerIp}
          >
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars for notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </AdminContainer>
  );
};

export default Admin; 