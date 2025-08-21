const loggerMiddleware = (req, res, next) => {
    // Log the incoming request
    console.log('\n------------------');
    console.log('📥 Incoming Request:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Query:', JSON.stringify(req.query));
    console.log('Body:', JSON.stringify(req.body));
    console.log('Headers:', JSON.stringify(req.headers));

    // Capture the original res.end to log response
    const originalEnd = res.end;
    const chunks = [];

    res.end = function (chunk) {
        if (chunk) {
            chunks.push(chunk);
        }

        // Log the response (only status and URL)
        console.log('\n🔄 Response:', new Date().toISOString());
        console.log('Status:', res.statusCode);
        console.log('URL:', req.url);
        console.log('-------------------\n');

        originalEnd.apply(res, arguments);
    };

    next();
};

module.exports = loggerMiddleware;
