import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import api from '../../src/api'
import moment from 'moment';

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

const ConfirmationPage = () => {
    const router = useRouter();
    const bookingNo = router.query.bookingNo as string;
    const [data, setData] = useState<Booking | null>(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            // Fetch booking details from API or database
            const fetchBooking = async () => {
                const response = await api.get(`/bookings/${bookingNo}`);
                setData(response.data);
            };
            fetchBooking();
        }
    }, [router]);

    if (!data) {
        return <Typography>Loading...</Typography>;
    }

    const handleCancelBooking = async () => {
        try {
            await api.put(`/bookings/${bookingNo}`);
            router.push('/confirmation');
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenCancelDialog = () => {
        setOpenCancelDialog(true);
    };

    const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
    };

    const handleConfirmCancel = () => {

        handleCancelBooking();
        setOpenCancelDialog(false);
    };
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4">Booking Confirmation</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <img src={data.car.image} alt={data.car.model} style={{
                            objectFit: 'contain',
                            maxWidth: '100%', // add this
                            height: 'auto', // add this
                        }} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking Details</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>Booking No</TableCell>
                                <TableCell>{data.booking.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Booking Status</TableCell>
                                <TableCell>{data.booking.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>{data.booking.customerName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Plate No</TableCell>
                                <TableCell>{data.booking.plateNo}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vehicle Model</TableCell>
                                <TableCell>{data.car.model}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Vehicle Year</TableCell>
                                <TableCell>{data.car.year}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Rental Rate</TableCell>
                                <TableCell>${data.car.price} per day</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Rental Period</TableCell>
                                <TableCell>{moment(data.booking.start_date).format('DD-MM-YYYY')} - {moment(data.booking.end_date).format('DD-MM-YYYY')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction={'row'} spacing={2}>
                        {data.booking.status === 'BOOKING' && <Button variant="contained" color="primary" onClick={() => handleOpenCancelDialog()}>
                            Cancel Booking
                        </Button>}
                        <Button variant="contained" color="secondary" onClick={() => router.push('/confirmation')}>
                            Back to Home Page
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
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
        </Box>
    );
};

export default ConfirmationPage;