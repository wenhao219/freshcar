import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Typography, Button, Stack, DialogTitle, Dialog, DialogContent, DialogContentText, DialogActions, Box, TableContainer } from '@mui/material';
import api from '../../src/api';
import CarImage from '../images/car.png'; // replace with your car image
import moment from 'moment';
import { formatDate } from '@/utils';
import { useRouter } from 'next/router';

interface Booking {
    booking: {
        carId: number;
        id: number;
        start_date: string; // ISO string format
        end_date: string; // ISO string format
        status: string;
        userId: number;
        customerName: string;
        plateNo: string;
    },
    car: {
        id: number;
        image: string;
        make: string;
        model: string;
        year: number;
        mileage: number;
        price: number;
        type: string;
        color: string;
    }
}

const BookingList = () => {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);

    useEffect(() => {
        handleGetList()
    }, []);

    const handleGetList = () => {
        api.get('/bookings')
            .then(response => {
                setBookings(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleCancelBooking = async (id: number | string) => {
        try {
            await api.put(`/bookings/${id}`);
            await handleGetList()
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenCancelDialog = (id: number) => {
        setCancelBookingId(id);
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
    };

    const handleConfirmCancel = () => {
        if (cancelBookingId) {
            handleCancelBooking(cancelBookingId);
            setOpenCancelDialog(false);
        }
    };

    const handleGoBack = () => {
        router.push('/homepage');
    };

    return (
        <div>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <h1>Booking Record List</h1>
                <Box alignContent={'center'} marginRight={'10px'}>
                    <Button variant="contained" color="primary" onClick={() => handleGoBack()}>
                        Back to Homepage
                    </Button>
                </Box>
            </Stack>
            <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Car Image</TableCell>
                        <TableCell>Car Make and Model</TableCell>
                        <TableCell>Rental Date Period</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={4}>Loading...</TableCell>
                        </TableRow>
                    ) : (
                        bookings.map(booking => (
                            <TableRow key={booking.booking.id}>
                                <TableCell>
                                    <img src={booking.car.image} alt="Car" width={100} style={{ objectFit: 'contain' }} />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">{booking.car.make}</Typography>
                                    <Typography variant="body1">{booking.car.model}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{formatDate(booking.booking.start_date)} - {formatDate(booking.booking.end_date)}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{booking.booking.status}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction={'row'} spacing={2}>
                                        <Button variant="contained" color="primary" size="small" onClick={() => router.push(`/confirmation/${booking.booking.id}`)}>
                                            View Details
                                        </Button>
                                        {booking.booking.status === 'BOOKING' && <Button variant="contained" color="error" size="small" onClick={() => handleOpenCancelDialog(booking.booking.id)}>
                                            Cancel
                                        </Button>}
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            </TableContainer>
            <Dialog
                open={openCancelDialog}
                onClose={handleCloseCancelDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Cancel Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCancelDialog}>No</Button>
                    <Button onClick={handleConfirmCancel} color="error">
                        Yes, Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BookingList;