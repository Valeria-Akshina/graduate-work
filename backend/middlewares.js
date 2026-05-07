const logger = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Запрос: ${req.method} на ${req.url}`);
    next();
};

module.exports = { logger };