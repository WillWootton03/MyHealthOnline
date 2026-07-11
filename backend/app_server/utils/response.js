/*
    HELPER functions to handle successful and failure route responses 
*/
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    return res
        .status(statusCode)
        .json({
            success: true,
            message,
            data,
        });
};

const sendError = (res, message, errorCode = 'INTERNAL_ERROR', statusCode = 400) => {
    return res
        .status(statusCode)
        .json({
            success: false,
            message,
            error: { code: errorCode},
        });
};

module.exports = {
    sendSuccess,
    sendError,
}