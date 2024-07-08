import Head from 'next/head';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../src/api';

interface LoginCredentials {
    username: string;
    password: string;
}

const LoginPage = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            // Call API or authenticate user here
            const res = await api.post('/auth/login',
                credentials,
            );
            if (res.status === 200) {
                // Redirect to protected route or homepage
                localStorage.setItem('role', res.data.role);
                if (res.data.role === 'admin') {
                    router.push('/admin/list'); // Redirect to admin homepage
                } else {
                    router.push('/homepage'); // Redirect to user homepage
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            setError('An error occurred while logging in');
        }
    };

    return (
        <Grid container spacing={2}>
            <Head>
                <title>Login</title>
            </Head>
            <Grid item xs={12}>
                <Typography variant="h4">Login</Typography>
            </Grid>
            <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                value={credentials.username}
                                onChange={(event) =>
                                    setCredentials({ ...credentials, username: event.target.value })
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Password"
                                type="password"
                                value={credentials.password}
                                onChange={(event) =>
                                    setCredentials({ ...credentials, password: event.target.value })
                                }
                                fullWidth
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="error">
                                    {error}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1">
                    {`Don't have an account?`} <Link href="/register">Register</Link>
                </Typography>
            </Grid>
        </Grid>
    );
};

export default LoginPage;