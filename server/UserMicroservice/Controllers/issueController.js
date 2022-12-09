import logger from "../logger/logger.js";
import { isBookAvailable, updateAvailableBook } from "../queries/BookQueries.js";
import { noOfBooksTaken, increaseTotalBooksTakenCount } from "../queries/StudentQueries.js";
import { createIssue } from "../queries/IssueQueries.js";

export const issueBook = async (req,res) => {
    /**
     * Issues books
     * @param {int} accession_number - Accession number of the book
     * @param {ObjectId} book_id - Object Id of the book
     * @param {ObjectId} student_id - Object Id of the student
     * @return {json} message - Successful issue creation
     */
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