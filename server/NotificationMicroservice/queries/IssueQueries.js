import issueModel from "../Models/issueModel.js";

export const createIssue = async (param) => {
    await issueModel.create({
        book_id: param.book_id,
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
}