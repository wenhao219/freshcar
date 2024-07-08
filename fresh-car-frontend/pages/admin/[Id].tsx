import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Container, Snackbar, Alert, Stack, MenuItem } from '@mui/material';
import api from '../../src/api';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface CarInventoryItem {
    make: string;
    model: string;
    color: string;
    image: any;
    year: number;
    mileage: number;
    price: string;
    id: number; // added id property
}

const AdminEditCarInventory: React.FC = () => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState(0);
    const [mileage, setMileage] = useState(0);
    const [price, setPrice] = useState('');
    const [color, setColor] = useState('');
    const [type, setType] = useState('');
    const [plateNo, setPlateNo] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [carInventoryItem, setCarInventoryItem] = useState<CarInventoryItem | null>(null);
    const router = useRouter(); // Initialize the router
    const id = router.query.Id;
    // fetch car inventory item by id on mount
    useEffect(() => {
        const id = window.location.pathname.split('/').pop();
        api.get(`/admin/inventory/${id}`)
            .then(response => {
                setCarInventoryItem(response.data);
                const carInventoryItem = response.data;
                setMake(carInventoryItem.make);
                setModel(carInventoryItem.model);
                setYear(carInventoryItem.year);
                setMileage(carInventoryItem.mileage);
                setPrice(carInventoryItem.price);
                setColor(carInventoryItem.color);
                setImage(carInventoryItem.image);
                setType(carInventoryItem.type);
                setPlateNo(carInventoryItem.plateNo);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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
            const response = await api.put(`/admin/inventory/${carInventoryItem?.id}`, formData);
            if (response.status === 200) {
                setSnackbarMessage('Car inventory item updated successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                // Redirect to admin list
                window.location.href = '/admin/list';
            } else {
                setSnackbarMessage('Error updating car inventory item');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error updating car inventory item');
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

    const isValidInput = (value: any) => {
        const regex = /^(?!.*\..*\.)[0-9]*(\.[0-9]{0,2})?$/;
        return regex.test(value);
    };

    const handleInputChange = (event: any) => {
        const inputValue = event.target.value;

        if (isValidInput(inputValue)) {
            setPrice(inputValue);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Car Inventory Item
            </Typography>
            {carInventoryItem && (
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
                                    Update Car Inventory Item
                                </Button>
                                <Link href="/admin/list">
                                    <Button variant="contained" color="primary">
                                        Back to List
                                    </Button>
                                </Link>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>)}
            <Snackbar open={openSnackbar} onClose={handleCloseSnackbar}>
                <Alert severity={snackbarSeverity as any}>{snackbarMessage}</Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminEditCarInventory;