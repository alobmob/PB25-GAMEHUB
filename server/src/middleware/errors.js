export function notFound(req, res, next) {
    res.status(404).json({error: 'Not Found'});
}

export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error'
    });
}