import logger from '../logger/logger.js';
import { booksAutocomplete, booksSearchByParams, booksPagination, countBooks } from '../queries/BookQueries.js';

export const getInitialData = async (req, res) => { 
    /**
     * Returns titles, authors and isbns for autocomplete
     * @return {json} titles - Titles of books
     * @return {json} authors - Authors of books
     * @return {json} isbns - ISBNs of books
     */
    try {
        const titles = await booksAutocomplete("book_detail.title");
        const authors = await booksAutocomplete("book_detail.author");
        const isbns = await booksAutocomplete("book_detail.isbn");
        const totalBooks = await countBooks();
        res.status(200).json({titles, authors, isbns, totalBooks});
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const searchBooks = async (req, res) => {
    /**
     * Returns book based upon the search parameters
     * @param {string} title - Title of book
     * @param {string} author - Author of book
     * @param {string} isbn - ISBN of book
     * @return {json} books - Books based upon the given query
     */
    try {
        const books = await booksSearchByParams(req.query);
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}

export const getBooks = async (req, res) => { 
    /**
     * Returns books based upon the page number
     * @param {int} page - Pagination page number
     * @return {json} books - Books based upon the page number
     * @return {int} totalBooks - Total number of books present in the database
     */
    try {
        const books = await booksPagination(parseInt(req.query.page), 20)
        res.status(200).json(books);
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ message: error.message });
    }
}
