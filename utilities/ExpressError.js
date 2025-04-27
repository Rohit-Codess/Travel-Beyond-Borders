class ExpressError extends Error {
    constructor(status, messase) {
        super();
        this.status = status;
        this.message = messase;
    };
};

module.exports = ExpressError;