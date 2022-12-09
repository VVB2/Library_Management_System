import studentModel from "../Models/studentModel.js";

export const noOfBooksTaken = async (param) => {
    return await studentModel.find({"_id": param}, {"books_taken": 1});
}

export const increaseTotalBooksTakenCount = async (param, count) => {
    await studentModel.updateOne({
        "_id": param
    },{ 
        "$inc": { "books_taken": count }
    })
}