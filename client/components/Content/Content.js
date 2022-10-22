import { Card, CardContent, Typography, CardHeader, CardMedia, Grid } from "@mui/material"

function Content({books}) {
    return (
        <Grid container spacing={3} style={{marginTop: '20px'}}>
            {books.map((book, index) => (
                <Grid xs={3} key={index} style={{marginTop: '20px'}}>
                    <Card sx={{maxHeight: 550}}>
                        <CardHeader 
                            title={`${book.book_detail.title.replace('&amp;', ' &').replace('And', '&').replace('and', '&')}`}
                            subheader={`Published Year: ${book.book_detail.publishedYear}`}
                        />
                        <CardMedia
                            component="img"
                            image={`${book.book_detail.image_url}`}
                            alt={`${book.book_detail.title}'s image`}
                            sx={{width: 'auto', maxHeight:'200px', display: 'block', margin: 'auto'}}
                        />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Author: {book.book_detail.author}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Publisher: {book.book_detail.publisher}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Chapters and Pages: {book.book_detail.pages}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Price: ₹{book.book_detail.price}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default Content