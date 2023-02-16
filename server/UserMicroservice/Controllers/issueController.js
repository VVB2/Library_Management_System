import logger from "../logger/logger.js";
import { isBookAvailable, updateAvailableBook } from "../queries/BookQueries.js";
import { noOfBooksTaken, increaseTotalBooksTakenCount, checkAuthorized } from "../queries/StudentQueries.js";
import { createIssueAndBookReturnNotification } from "../queries/IssueQueries.js";

/**
 * Issues books
 * @param {int} accession_number - Accession number of the book
 * @param {ObjectId} student_id - Object Id of the student
 * @return {json} message - Issue successfully created
 */
export const issueBook = async (req,res) => {
    try {
        const { authorized } = await checkAuthorized(req.body.student_id);
        if(authorized) {
            const bookAvailable = await isBookAvailable(req.body.accession_number);
            const user_book_taken = await noOfBooksTaken(req.body.student_id);
            if (bookAvailable.length > 0) {
                if (user_book_taken[0].books_taken >= 3) {
                    return res.status(200).json({ message: 'Book Issue limit reached!' });
                }
                else if (user_book_taken[0].fine_pending >= 50) {
                    return res.status(200).json({ message: 'Please pay the fine before issuing book' });
                }
                await updateAvailableBook(req.body, "$pull");
                await increaseTotalBooksTakenCount(req.body.student_id, 1);
                await createIssueAndBookReturnNotification(req.body);
                logger.info(`Book with accession number [${req.body.accession_number}] issued by [${user_book_taken[0].name}]`);
                return res.status(201).json({ success:true, message: 'Issue successfully created'});
            } else {
                return res.status(404).json({ success:false, message: 'Book not found' });
            }
        }
        logger.info(`Unauthorized issue by [${user_book_taken[0].name}]`);
        return res.status(401).json({ success:false, message: 'You are not authorized to perform this task' });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}