import issueModel from "../Models/issueModel.js";
import bookReturnModel from "../Models/bookReturnModel.js";

export const createIssueAndBookReturnNotification = async (param) => {
    await issueModel.create({
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
    await bookReturnModel.create({
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
}
