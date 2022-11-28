import logger from "../logger/logger.js";
import { isBookAvailable, updateAvailableBook } from "../queries/BookQueries.js";
import { noOfBooksTaken, increaseTotalBooksTakenCount } from "../queries/StudentQueries.js";
import { createIssue, updateIssue, findStudent } from "../queries/IssueQueries.js";

/**
 * Issues books
 * @param {int} accession_number - Accession number of the book
 * @param {ObjectId} book_id - Object Id of the book
 * @param {ObjectId} student_id - Object Id of the student
 * @return {json} message - Successful issue creation
 */
export const issueBook = async (req,res) => {
    try {
        const bookAvailable = await isBookAvailable(req.body.accession_number);
        const user_book_taken = await noOfBooksTaken(req.body.student_id);
        if (bookAvailable.length > 0 && !(user_book_taken[0].books_taken >= 3)) {
            await updateAvailableBook(req.body, "$pull");
            await increaseTotalBooksTakenCount(req.body.student_id, 1);
            await createIssue(req.body);
            logger.info(`Book with accession number '${req.body.accession_number}' issued by ${req.body.student_id}`);
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
        const student_id = await findStudent(req.body.accession_number);
        await updateAvailableBook(req.body, "$push");
        await increaseTotalBooksTakenCount(student_id[0].student_id, -1);
        await updateIssue(req.body, today);
        logger.info(`Book with accession number '${req.body.accession_number}' returned on ${today.toLocaleDateString('en-GB')} to ${req.body.returned_to}`);
        res.status(200).json({ message: 'Book successfully returned' });
    } catch (error) {
        logger.error(error.message);
    }
}