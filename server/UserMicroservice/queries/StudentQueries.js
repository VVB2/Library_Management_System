import studentModel from "../Models/studentModel.js";

export const noOfBooksTaken = async (student_id) => {
    return await studentModel.find({"_id": student_id}, {"books_taken": 1, "_id": 0, "name": 1});
}

export const increaseTotalBooksTakenCount = async (student_id, count) => {
    await studentModel.updateOne({
        "_id": student_id
    },{ 
        "$inc": { "books_taken": count }
    })
}

export const checkAuthorized = async (student_id) => {
    return await studentModel.findById(student_id);
}