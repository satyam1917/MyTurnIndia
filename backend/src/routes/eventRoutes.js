const express = require('express');
const adminAuth = require('../middleware/adminauth');
const userAuth = require('../middleware/userAuth');
const eventsRouter = express.Router();
const {upload}=require('../multer/multerConfig');
const { createPaidEvent, createUnpaidEvent, getAllEvents, getEventsByType, deleteEvent, updateEvent, getEventsWithPurchasedTickets } = require('../controllers/admin/eventController');

eventsRouter.post('/create-paid-event',adminAuth,upload.single("banner"),createPaidEvent);
eventsRouter.post('/create-unpaid-event',adminAuth,upload.single("banner"),createUnpaidEvent);
eventsRouter.post('/get-all-events',getAllEvents);
eventsRouter.get('/events',adminAuth,getEventsByType);
eventsRouter.delete('/events/:id',adminAuth,deleteEvent);
eventsRouter.put('/events/:id',adminAuth,upload.single("banner"),updateEvent);
eventsRouter.get('/events-with-purchased-tickets',userAuth,getEventsWithPurchasedTickets);


module.exports = eventsRouter;