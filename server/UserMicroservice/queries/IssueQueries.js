import issueModel from "../Models/issueModel.js";

export const createIssueAndBookReturnNotification = async (param) => {
    await issueModel.create({
        accession_number: param.accession_number,
        student_id: param.student_id,
    });
}
