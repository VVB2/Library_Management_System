import logger from "../logger/logger.js";
import booksModel from "../Models/booksModel.js";
import issueModel from "../Models/issueModel.js";

/**
 * Issues books
 * @param {int} accession_number - Accession number of the book
 * @param {ObjectId} book_id - Object Id of the book
 * @param {ObjectId} student_id - Object Id of the student
 * @return {json} message - Successful issue creation
 */
export const issueBook = async (req,res) => {
    try {
        const bookAvailable = await booksModel.find({ "available_books": { "$all" : [req.body.accession_number] }});
        if (bookAvailable.length > 0) {
            await booksModel.updateOne({
                "_id": req.body.book_id
            }, {
                "$pull": { "available_books": req.body.accession_number }
            });
            await issueModel.create({
                book_id: req.body.book_id,
                accession_number: req.body.accession_number,
                student_id: req.body.student_id,
            });
            logger.info(`Issue created`);
            res.status(201).json({message: 'Issue successfully created'});
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        logger.error(error.message);
    }
}

/**
 * Returns books
 * @param {int} accession_number - Accession number of the book
 * @param {ObjectId} book_id - Object Id of the book
 * @param {ObjectId} returned_to - Object Id of the librarian
 * @return {json} message - Successful return book
 */
export const returnBook = async (req,res) => {
    try {
        const today = new Date();
        const bookAvailable = await booksModel.find({ "accession_books_list": { "$all" : [req.body.accession_number] }});
        if (bookAvailable.length > 0) {
            await booksModel.updateOne({
                "accession_books_list": { "$all" : [req.body.accession_number] }
            }, {
                "$push": { "available_books": req.body.accession_number }
            });
            await issueModel.updateOne({ "accession_number": req.body.accession_number }, { "returned_on": today, "returned_to": req.body.returned_to });
            logger.info(`Book with accession number '${req.body.accession_number}' returned on ${today.toLocaleDateString()}`);
            res.status(200).json({ message: 'Book successfully returned' });
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        logger.error(error.message);
        console.log(error.message);
    }
}