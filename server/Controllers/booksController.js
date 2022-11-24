import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';

export const getBooks = async (req, res) => { 
    const noOfBooks = 20;
    const page = parseInt(req.query.page);
    try {
        //get page number from query and skip using page_number*page_size
        const books = await booksModel.find().limit(noOfBooks).skip((page-1)*noOfBooks);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const getAutocomplete = async (req, res) => { 
    try {
        //get all book titles, authors and isbns
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

export const searchBooks = async (req, res) => {
    try {
        //search books by title, author or isbn
        const { title, author, isbn } = req.body;
        const queryObj = {};
        if (title) queryObj['book_detail.title'] = title
        if (author) queryObj['book_detail.author'] = author
        if (isbn) queryObj['book_detail.isbn'] = isbn
        const books = await booksModel.find(queryObj);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}