

function router(app) {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // Wrong route
    app.use((req, res) => {
        res.status(404).send('404 Not Found');
    })
}

export default router;