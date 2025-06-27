const dotenv = require('dotenv');
dotenv.config({ path: './src/.env' });
const express = require('express');
const cros=require('cors');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/usersRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const path = require('path');
const eventsRouter = require('./routes/eventRoutes');
const announcementsRouter = require('./routes/announcementRoutes');
const resourcesRouter = require('./routes/resourcesRouter');
const app = express();
const PORT=3000;
app.use(express.json());
app.use(cros());
app.use("/users", usersRoutes);
app.use("/admin", adminRoutes);
app.use("/users", ordersRoutes);
app.use("/courses", coursesRoutes);
app.use("/payment",paymentRouter);
app.use("/event",eventsRouter);
app.use("/announcement",announcementsRouter);
app.use("/resource",resourcesRouter);
app.use('/images', express.static(path.join(__dirname,"assets","images")));
app.use('/certificate', express.static(path.join(__dirname,"assets","certificates")));
app.use('/materials', express.static(path.join(__dirname,"assets","materials")));

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log('App listening on port 3000!');
    });
});


