import axios from 'axios';
import logger from '../logger/logger.js';
import booksModel from '../Models/booksModel.js';
import {  } from '../queries/BookQueries.js';

export const singleInsert = async (req, res) => {
    /**
     * Adds or Updates books in the database
     * This function is not yet fully implemented
     */
    const MICROSERVICE_URI = process.env.MICROSERVICE_URI;
    const present = await booksModel.countDocuments({ "book_detail.isbn": req.body.isbn }) > 0;
    try {
        if(present) {
            await booksModel.updateOne(
                {
                    "book_detail.isbn": req.body.isbn
                },
                {
                    "$push": {
                        "accession_books_list": req.body.accession_books_list,
                        "available_books": req.body.available_books
                    },
                }
            )
            res.status(201).json({ message: 'Added Successfully' });
        }
        else {
            await axios.get(`${MICROSERVICE_URI}/test`)
            .then(function (response) {
                console.log(response);
                })
                .catch(function (error) {
                console.log(error);
                })
            // res.status(201).json({ message: 'Added Successfully' });
        } 
    } catch (error) {
        logger.error(error.message);
        res.status(401).json({ message: error.message });
    }
    
}   

