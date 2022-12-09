import studentModel from "../Models/studentModel.js";

export const increaseTotalBooksTakenCount = async (param, count) => {
    await studentModel.updateOne({
        "_id": param
    },{ 
        "$inc": { "books_taken": count }
    })
}