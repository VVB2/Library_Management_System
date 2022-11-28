import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';
import { booksAutocomplete, booksSearchByParams, booksPagination } from '../queries/BookQueries.js';

/**
 * Returns titles, authors and isbns for autocomplete
 * @return {json} titles - Titles of books
 * @return {json} authors - Authors of books
 * @return {json} isbns - ISBNs of books
 */
export const getInitialData = async (req, res) => { 
    try {
        const titles = await booksAutocomplete("book_detail.title");
        const authors = await booksAutocomplete("book_detail.author");
        const isbns = await booksAutocomplete("book_detail.isbn");
        const totalBooks = await booksModel.countDocuments();
        res.status(200).json({titles, authors, isbns, totalBooks});
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

/**
 * Returns book based upon the search parameters
 * @param {string} title - Title of book
 * @param {string} author - Author of book
 * @param {string} isbn - ISBN of book
 * @return {json} books - Books based upon the given query
 */
export const searchBooks = async (req, res) => {
    try {
        const books = await booksSearchByParams(req.query);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

/**
 * Returns books based upon the page number
 * @param {int} page - Pagination page number
 * @return {json} books - Books based upon the page number
 * @return {int} totalBooks - Total number of books present in the database
 */
export const getBooks = async (req, res) => { 
    try {
        const books = await booksPagination(parseInt(req.query.page), 20)
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

/**
 * Adds or Updates books in the database
 * This function is not yet fully implemented
 */
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

