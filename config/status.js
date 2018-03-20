const status = {
    ERROR: {
        BAD_REQUEST: {
            statusCode: 400
        },
        NOT_FOUND: {
            statusCode: 404
        }
    },
    SUCCESS: {
        DEFAULT: 200
    }
};

module.exports = {
    status: status
}
