import * as React from 'react';
import { useState } from 'react';
import { Grid, TextField, Button, Typography, Container, Snackbar, Alert, Stack, MenuItem } from '@mui/material';
import api from '../../src/api';
import Link from 'next/link';

interface CarInventoryItem {
    make: string;
    model: string;
    color: string;
    image: any;
    year: number;
    mileage: number;
    price: string;
}

const AdminCreateCarInventory: React.FC = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(0);
    const [mileage, setMileage] = useState(0);
    const [price, setPrice] = useState('');
    const [color, setColor] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [type, setType] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('make', make);
        formData.append('model', model);
        formData.append('year', year.toString());
        formData.append('mileage', mileage.toString());
        formData.append('price', price);
        formData.append('color', color);
        formData.append('type', type);
        formData.append('plateNo', plateNo);
        if (image) {
            formData.append('image', image);
        }
        try {
            const response = await api.post('/admin/inventory', formData);
            if (response.status === 201) {
                setSnackbarMessage('Car inventory item created successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                // Redirect to admin list
                window.location.href = '/admin/list';
            } else {
                setSnackbarMessage('Error creating car inventory item');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error creating car inventory item');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleColorChange = (event: any) => {
        setColor(event.target.value);
    };

    const handleImageChange = (event: any) => {
        setImage(event.target.files[0]);
    };

    const handleTypeChange = (event: any) => {
        setType(event.target.value);
    };

    // is valid function to check value is valid 
    const isValidInput = (value: any) => {
        const regex = /^(?!.*\..*\.)[0-9]*(\.[0-9]{0,2})?$/;
        return regex.test(value);
    };
    // change function to set value to text field on change
    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;

        if (isValidInput(inputValue)) {
            setPrice(inputValue);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Car Inventory Item
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Make"
                            value={make}
                            onChange={event => setMake(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Model"
                            value={model}
                            onChange={event => setModel(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Plate No"
                            value={plateNo}
                            onChange={event => setPlateNo(event.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Car Type"
                            value={type}
                            onChange={handleTypeChange}
                            fullWidth
                        >
                            <MenuItem value="Sedan">Sedan</MenuItem>
                            <MenuItem value="Hatchback">Hatchback</MenuItem>
                            <MenuItem value="SUV">SUV</MenuItem>
                            <MenuItem value="Truck">Truck</MenuItem>
                            <MenuItem value="Convertible">Convertible</MenuItem>
                            <MenuItem value="Coupe">Coupe</MenuItem>
                            <MenuItem value="Wagon">Wagon</MenuItem>
                            <MenuItem value="Minivan">Minivan</MenuItem>
                            <MenuItem value="Van">Van</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Year"
                            type="number"
                            value={year}
                            onChange={event => setYear(parseInt(event.target.value, 10))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Mileage"
                            type="number"
                            value={mileage}
                            onChange={event => setMileage(parseInt(event.target.value, 10))}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Price"
                            type="number"
                            value={price}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Color"
                            value={color}
                            onChange={handleColorChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                            <Button type="submit" variant="contained" color="primary">
                                Create Car Inventory Item
                            </Button>
                            <Link href="/admin/list">
                                <Button variant="contained" color="primary">
                                    Back to List
                                </Button>
                            </Link>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
            <Snackbar open={openSnackbar} onClose={handleCloseSnackbar}>
                <Alert severity={snackbarSeverity as any}>{snackbarMessage}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminCreateCarInventory;