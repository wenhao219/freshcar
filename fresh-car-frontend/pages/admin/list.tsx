import React, { useState, useEffect } from 'react';
import api from '../../src/api';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, CircularProgress, Link, Stack, Box, Container, TableContainer } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  plateNo: string;
  image: string;
}

const AdminCarListView: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  useEffect(() => {
    api.get('/admin/inventory')
      .then(response => {
        setCars(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleDeleteCar = (id: number) => {
    const car = cars.find(car => car.id === id);
    if (car) {
      setCarToDelete(car);
      setOpenDialog(true);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    if (carToDelete) {
      api.delete(`/admin/inventory/${carToDelete.id}`)
        .then(() => {
          setCars(cars.filter(car => car.id !== carToDelete.id));
        })
        .catch(error => {
          console.error(error);
        });
    }
    setOpenDialog(false);
  };

  const handleLogout = () => {
    // Add your logout API call or logic here
    api.post('/auth/logout')
      .then(() => {
        // Redirect to login page or perform any other action after logout
        window.location.href = '/';
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container>
      <Stack direction={{xs: 'column',sm:'row'}} justifyContent={'space-between'}>
      <h1>Admin Car List</h1>
      <Box alignContent={{xs: 'left', sm:'center'}}>
        <Stack direction={'row'} spacing={2} sx={{justifyContent: {xs: 'left', sm:'right'}}} width={"100%"}>
          <Button variant="contained" color="primary" component={Link} href="/admin/create">
            Create Car
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Box>
      </Stack>
      <br />
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer sx={{
          width: '100%',
          minWidth: { md: 'none' },
          overflow: { md: 'auto' }
        }}>
        <Table sx={{ minWidth: 700, overflowX: 'auto' }}>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Plate No</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.length > 0 ? (
              cars.map(car => (
                <TableRow key={car.id}>
                  <TableCell>
                    <img src={car.image} alt={car.model} width={100} style={{ objectFit: 'contain' }} />
                  </TableCell>
                  <TableCell>{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.plateNo}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                    <Button variant="contained" color="error" onClick={() => handleDeleteCar(car.id)}>
                      Delete
                    </Button>
                    <Button variant="contained" color="primary" component={Link} href={`/admin/${car.id}`}>
                      Edit
                    </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No data found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
      )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete car {carToDelete?.make} {carToDelete?.model}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminCarListView;