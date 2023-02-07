import logger from '../logger/logger.js';
import { booksAutocomplete, booksSearchByParams, booksPagination, countBooks, watchListQuery } from '../queries/BookQueries.js';
import { checkAuthorized } from '../queries/StudentQueries.js';

export const getBooks = async (req, res) => { 
    /**
     * Returns books based upon the page number
     * @param {int} page - Pagination page number
     * @return {json} books - Books based upon the page number
     */
    try {
        const books = await booksPagination(parseInt(req.query.page), 20);
        res.status(200).json({ success:true,books });
    } catch (error) {
        logger.error(error.message);
        res.status(404).json({ success:false, message: error.message });
    }
}

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
        return res.status(200).json({success:true, titles, authors, isbns, totalBooks});
    } catch (error) {
        logger.error(error.message);
        return res.status(404).json({ success:false, message: error.message });
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
        return res.status(200).json({ success:true, books });
    } catch (error) {
        logger.error(error.message);
        return res.status(404).json({ success:false, message: error.message });
    }
}

export const watchList = async (req, res) => {
    /**
     * Adds book into the queue for watchlist
     * @param {ObjectId} book_id - Object Id of book
     * @param {ObjectId} student_id - Object Id of student
     * @return {json} message - Book successfully added to watchlist
     */
    try {
        const { authorized, name, email } = await checkAuthorized(req.body.student_id);
        if(authorized) {
            await watchListQuery(req.body, name, email);
            return res.status(201).json({ success:true, message: 'Book successfully added to watchlist' });
        }
        return res.status(401).json({ success:false, message: 'You are not authorized to perform this task' });
    } catch (error) {
        logger.error(error.message);
        return res.status(404).json({ success:false, message: error.message });
    }
}
