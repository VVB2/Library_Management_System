import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';
import {  } from '../queries/BookQueries.js';

export const addUpdateBook = async (req, res) => {
    /**
     * Adds or Updates books in the database
     * This function is not yet fully implemented
     */
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

