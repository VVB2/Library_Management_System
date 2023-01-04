import issueModel from "../Models/issueModel.js";

export const updateIssue = async (param, date) => {
    await issueModel.findOneAndUpdate(
        { "accession_number": param.accession_number }, 
        { "returned_on": date, "returned_to": param.returned_to },
        { "sort": { "issued_on": -1 } }
    );
}

export const findStudent = async (param) => {
    return issueModel.find(
        { "accession_number": param },
    ).sort({"issued_on": -1}).limit(1);
}