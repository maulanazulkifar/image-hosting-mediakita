import React, { useEffect, useState } from "react";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    Pagination,
    styled,
    Snackbar,
    Alert,
    Paper,
    IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import imageCompression from "browser-image-compression";
import getImage from "../../services/ImageServices/Get";
import PostImage from "../../services/ImageServices/Post";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const StyledCard = styled(Card)(({ theme }) => ({
    width: 345,
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
    }
}));

const Home = () => {
    const key = import.meta.env.VITE_UPLOAD_KEY;
    const [images, setImages] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [password, setPassword] = useState();
    const [page, setPage] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const imagesPerPage = 6;

    useEffect(() => {
        fetchImage();
    }, [page]);

    const fetchImage = () => {
        setIsLoad(true);
        getImage()
            .then((res) => setImages(res.objects.reverse()))
            .finally(() => setIsLoad(false));
    };

    const handlePostImage = async (data) => {
        if (password === key) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 2000,
                useWebWorker: true,
            };

            try {
                setIsLoad(true);
                const compressedFile = await imageCompression(data, options);
                const formData = new FormData();
                formData.append("image", compressedFile);
                await PostImage(formData);
                fetchImage();
                setSnackbar({ open: true, message: "Image uploaded successfully!", severity: "success" });
            } catch (error) {
                setSnackbar({ open: true, message: "Error uploading image.", severity: "error" });
            } finally {
                setIsLoad(false);
            }
        }
    };

    const handleChangePage = (event, value) => setPage(value);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const currentImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    return (
        <Container maxWidth="lg" sx={{ 
            mt: 4,
            minHeight: '100vh',
            background: 'white',
            borderRadius: '24px',
            padding: '40px 20px'
        }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={password !== key}>
                <Dialog open={password !== key} PaperProps={{ 
                    style: { 
                        borderRadius: '16px',
                        padding: '16px'
                    }
                }}>
                    <DialogTitle sx={{ fontWeight: 600 }}>Access Locked</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Enter the password to access the page.</DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </DialogContent>
                </Dialog>
            </Backdrop>

            {isLoad && (
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress />
                </Backdrop>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <img 
                    src="https://mediakita.ghavio.my.id/mediakitalogo.png" 
                    alt="MediaKita Logo"
                    style={{ 
                        width: '200px',
                        height: 'auto',
                        marginBottom: '20px'
                    }}
                />
            </Box>

            <Typography variant="h3" align="center" gutterBottom sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Media Image Hosting
            </Typography>

            <Box display="flex" justifyContent="center" sx={{ mb: 5 }}>
                <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    sx={{ 
                        px: 6, 
                        py: 2,
                        borderRadius: '30px',
                        background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                        boxShadow: '0 3px 5px 2px rgba(244, 67, 54, .3)',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s ease'
                        }
                    }}
                >
                    Upload Image
                    <VisuallyHiddenInput
                        accept="image/*"
                        type="file"
                        onInput={(e) => handlePostImage(e.target.files[0])}
                    />
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3 }}>
                {currentImages.map((item) => (
                    <StyledCard key={item.key}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={`https://assets.mediakita.cloud/${item.key}`}
                            alt="Uploaded"
                            sx={{ borderRadius: '16px 16px 0 0' }}
                        />
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                background: '#ffebee',
                                borderRadius: '8px',
                                p: 1,
                                mb: 2
                            }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        wordWrap: "break-word",
                                        flex: 1,
                                        mr: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                >
                                    {`https://assets.mediakita.cloud/${item.key}`}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            `https://assets.mediakita.cloud/${item.key}`
                                        )
                                    }
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </StyledCard>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
                <Pagination
                    count={Math.ceil(images.length / imagesPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    sx={{
                        '& .MuiPaginationItem-root': {
                            borderRadius: '12px',
                        }
                    }}
                    color="error"
                />
            </Box>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity} 
                    sx={{ 
                        width: "100%",
                        borderRadius: '12px'
                    }}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Home;
