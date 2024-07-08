import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, Typography, Card, CardMedia, CardContent, CardActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../src/api'
import { useRouter } from 'next/router';

export interface Car {
    id: number;
    model: string;
    make: string;
    price: number;
    image: string;
    type: string;
}

const HomePage = () => {
    const router = useRouter();
    const [cars, setCars] = useState<Car[]>([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [carType, setCarType] = useState('');

    useEffect(() => {
        // Fetch available cars from API or database
        const fetchCars = async () => {
            const params: any = {};
            if (minPrice > 0) {
                params.minPrice = minPrice;
            }
            if (maxPrice > 0) {
                params.maxPrice = maxPrice;
            }
            if (carType !== '') {
                params.type = carType;
            }
            const response = await api.get('/cars', { params });
            setCars(response.data);
        };
        fetchCars();
    }, [minPrice, maxPrice, carType]);

    const handleMinPriceChange = (event: any) => {
        setMinPrice(event.target.value);
        router.push({
            pathname: router.pathname,
            query: { minPrice: event.target.value },
        });
    };

    const handleMaxPriceChange = (event: any) => {
        setMaxPrice(event.target.value);
        router.push({
            pathname: router.pathname,
            query: { maxPrice: event.target.value },
        });
    };

    const handleCarTypeChange = (event: any) => {
        setCarType(event.target.value);
        router.push({
            pathname: router.pathname,
            query: { type: event.target.value },
        });
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
        <Grid container spacing={2}>
            <Head>
                <title>Car Rental App</title>
            </Head>
            <Grid item xs={12}>
                <Stack direction={'row'} spacing={2} sx={{ float: 'right' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            router.push(`/confirmation`);
                        }}
                    >
                        View Bookings
                    </Button>
                    <Button variant="contained" color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4">Available Cars</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1">Filter by:</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            label="Min Price"
                            type="number"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Max Price"
                            type="number"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Car Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Car Type"
                                value={carType}
                                onChange={handleCarTypeChange}
                                fullWidth
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Sedan">Sedan</MenuItem>
                                <MenuItem value="Hatchback">Hatchback</MenuItem>
                                <MenuItem value="SUV">SUV</MenuItem>
                                <MenuItem value="Truck">Truck</MenuItem>
                                <MenuItem value="Convertible">Convertible</MenuItem>
                                <MenuItem value="Coupe">Coupe</MenuItem>
                                <MenuItem value="Wagon">Wagon</MenuItem>
                                <MenuItem value="Minivan">Minivan</MenuItem>
                                <MenuItem value="Van">Van</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            {cars.length > 0 ? cars.map((car) => (
                <Grid item xs={12} sm={6} md={4} key={car.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            alt={car.model}
                            height="150"
                            image={car.image}
                        />
                        <CardContent>
                            <Typography variant="h5">{car.make} {car.model}</Typography>
                            <Typography variant="body1">Type: {car.type}</Typography>
                            <Typography variant="body1">Price per day: ${car.price}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button component={Link} href={`/booking/${car.id}`}>
                                Book Now
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            )) :
                <Grid item xs={12}>
                    <Typography variant="body1">No cars available</Typography>
                </Grid>
            }
        </Grid>
    );
};

export default HomePage;