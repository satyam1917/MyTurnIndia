const express = require('express');
const adminAuth = require('../middleware/adminauth');
const { createAnnouncement, getAllAnnouncements, updateAnnouncement, deleteAnnouncement } = require('../controllers/admin/announcementController');
const announcementsRouter = express.Router();

announcementsRouter.post('/create',adminAuth,createAnnouncement);
announcementsRouter.get('/',getAllAnnouncements);
announcementsRouter.put('/',adminAuth,updateAnnouncement);
announcementsRouter.delete('/',adminAuth,deleteAnnouncement);


module.exports = announcementsRouter;