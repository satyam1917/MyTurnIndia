const express = require('express');
const ordersRouter = express.Router();

ordersRouter.get('/', (req, res) => {
    res.send('Hello World!');
});

module.exports = ordersRouter;