import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';

//get all book titles, authors and isbns
export const getAutocomplete = async (req, res) => { 
    try {
        const titles = await booksModel.distinct("book_detail.title");
        let authors = await booksModel.distinct("book_detail.author");
        const isbns = await booksModel.distinct("book_detail.isbn");
        authors = authors.filter(Boolean);
        res.status(200).json({titles, authors, isbns});
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

//search books by title, author or isbn
export const searchBooks = async (req, res) => {
    try {
        // const { title, author, isbn } = req.body;
        const queryObj = {};
        const usp = new URLSearchParams(req.query);
        for (const [key, value] of usp) {
            queryObj[`book_detail.${key}`] = value
        }
        const books = await booksModel.find(queryObj);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

//get page number from query and skip using page_number*page_size
export const getBooks = async (req, res) => { 
    const noOfBooks = 20;
    const page = parseInt(req.query.page);
    try {
        const books = await booksModel.find().limit(noOfBooks).skip((page-1)*noOfBooks);
        const totalBooks = await booksModel.countDocuments();
        res.status(200).json({ books, totalBooks });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const addUpdateBook = async (req, res) => {
    const MICROSERVICE_URI = process.env.MICROSERVICE_URI;
    const present = await booksModel.countDocuments({ "book_detail.isbn": req.body.isbn }) > 0;
    let image_url = present ? await booksModel.find({"book_detail.isbn": req.body.isbn}, {"book_detail.image_url": 1}) : '';
    image_url = image_url[0].book_detail[0].image_url;
    booksModel.updateOne(
        {
            "book_detail.isbn": req.body.isbn
        },
        {
            book_detail: {
                title: req.body.title,
                isbn: req.body.isbn, 
                publishedYear: req.body.publishedYear,
                author: req.body.author,
                price: req.body.price,
                publisher: req.body.publisher,
                pages: req.body.pages,
                entry_date: req.body.entry_date,
                image_url: image_url,
            },
            accession_books_list: req.body.accession_books_list,
            available_books: req.body.available_books
        },
        {
            "upsert": true
        }
    )
    res.send(image_url);
}   

