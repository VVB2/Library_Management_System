import axios from 'axios';
import { useState, useEffect } from 'react';
import { Row } from 'antd';
import BookCard from '../../Components/BookCard';

export default function Books() {
    const [books, setBooks] = useState([]);
    let totalBooks = 0;
    useEffect(() => {
        const fetchBooks = async () => {
            await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/books/getBooks`)
            .then(function (res) {
                setBooks(res.data.books);
                totalBooks = res.data.totalBooks;
            })
        }
        fetchBooks()
    }, [])
    
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                { books.map((item, index) => (
                    <BookCard data={item} key={index}/>
                ))}
            </Row>
        </div>
    )
}