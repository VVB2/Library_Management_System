import { Card, CardContent, Typography, CardActions, CardMedia, Grid, Paper, IconButton, CardHeader, Avatar, Chip } from "@mui/material";
import NotificationsActiveIcon  from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications'

function Content({books}) {

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    function capitalize(title) {
        return title.charAt(0).toUpperCase() + title.toLowerCase().slice(1)
    }
    return (
        <Grid container columnSpacing={3} rowSpacing={2} style={{margin: '0 10px 30px 10px', width: '98%'}}>
            {books.map((book, index) => (
                <Grid item xs={6} md={4} lg={3} key={index} style={{marginTop: '20px'}}>
                        <Paper elevation={3}>
                        <Card sx={{minHeight:450}} 
                        // style={book.available_books.length > 0 ? {backgroundColor: 'blue'} : {backgroundColor: 'green'}}
                        >
                            <CardHeader
                                avatar={
                                <Avatar sx={{ bgcolor: 'rgb(244, 67, 54)' }} aria-label="author">
                                    {book.book_detail.author!==null ? book.book_detail.author.substring(0,1) : 'NA'}
                                </Avatar>
                                }
                                title={capitalize(book.book_detail.title).replace('&amp;', ' &').replace('And', '&').replace('and', '&')}
                                subheader={book.book_detail.publishedYear}
                            />
                            <CardMedia
                                component="img"
                                image={`${book.book_detail.image_url}`}
                                alt={`${book.book_detail.title}'s image`}
                                sx={{width: 'auto', maxHeight:'200px', display: 'block', margin: '5px auto', minHeight: '200px'}}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" className="details">
                                    Author: {book.book_detail.author}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" className="details">
                                    Publisher: {book.book_detail.publisher}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Chapters and Pages: {book.book_detail.pages}
                                </Typography>
                            </CardContent>
                            {book.available_books.length > 0 ? 
                            <Chip color="success" label={`${book.available_books.length} books available`} variant="outlined" style={{
                               display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 10px 0 10px'}}/> :
                            (
                                <Chip label="Custom delete icon" onClick={handleClick} onDelete={handleDelete} deleteIcon=      {<NotificationsActiveIcon />} />
                            )}
                        </Card>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

export default Content