import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Car } from '../homepage';
import api from '../../src/api'

interface Booking {
    carId: number;
    customerName: string;
    startDate: Date;
    endDate: Date;
}

const BookingPage = () => {
    const router = useRouter();
    const [carId, setCarId] = useState<any>(router.query?.carId || '');
    const [car, setCar] = useState<Car | null>(null);
    const [booking, setBooking] = useState<Booking>({
        carId,
        customerName: '',
        startDate: new Date(),
        endDate: new Date(),
    });

    useEffect(() => {
        if (router.isReady) {
            setCarId(router.query.carId)
            // Fetch car details from API or database
            const fetchCar = async () => {
                const response = await api.get(`/cars/${carId}`);
                setCar(response.data);
            };
            fetchCar();
        }
    }, [router]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit booking to API or database
        const response = await api.post('/bookings', booking);
        router.push(`/confirmation/${response.data.id}`);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Book a Car</Typography>
            </Grid>
            {car && (
                <Grid item xs={12}>
                    <img
                        src={car.image}
                        alt={car.model}
                        width="50%" // adjust the width to a smaller value
                        height="150px" // add a fixed height
                        style={{ objectFit: 'contain' }} // add this to maintain aspect ratio
                    />
                    <Typography variant="h5">Car Details:</Typography>
                    <Typography variant="body1">Make: {car.make}</Typography>
                    <Typography variant="body1">Model: {car.model}</Typography>
                    <Typography variant="body1">Type: {car.type}</Typography>
                    <Typography variant="body1">Price per day: ${car.price}</Typography>
                </Grid>
            )}
            {car && (
                <Grid item xs={12}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Name'
                                        value={booking.customerName}
                                        onChange={(event) =>
                                            setBooking({ ...booking, customerName: event.target.value })
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Start Date"
                                        type="date"
                                        value={booking.startDate.toISOString().split('T')[0]}
                                        onChange={(event) =>
                                            setBooking({ ...booking, startDate: new Date(event.target.value) })
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="End Date"
                                        type="date"
                                        value={booking.endDate.toISOString().split('T')[0]}
                                        onChange={(event) =>
                                            setBooking({ ...booking, endDate: new Date(event.target.value) })
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Book Now
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            )}
        </Grid>
    );
};

export default BookingPage;