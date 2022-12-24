import bookNotificationModel from "../Models/bookNotificationModel.js";

export const checkBookNotification = async(book_id) => {
    return bookNotificationModel.find({ "book_id": book_id });
}