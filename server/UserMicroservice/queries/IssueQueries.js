import issueModel from "../Models/issueModel.js";
import bookNotificationModel from '../Models/bookReturnNotificationModel.js';

export const createIssueAndBookReturnNotification = async (param) => {
    await issueModel.create({
        book_id: param.book_id,
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
    await bookNotificationModel.create({
        book_id: param.book_id,
        student_id: param.student_id,
    });
}
