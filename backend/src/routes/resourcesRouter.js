const express = require('express');
const { updateResources, fetchResources, addFounder, deleteFounder } = require('../controllers/admin/resourcesController');
const adminAuth = require('../middleware/adminauth');
const {upload}=require('../multer/multerConfig');

const resourcesRouter = express.Router();

resourcesRouter.put('/',adminAuth,updateResources);
resourcesRouter.get('/',fetchResources);
resourcesRouter.post('/add-founder',adminAuth,upload.single("image"),addFounder);
resourcesRouter.delete('/:id',adminAuth,deleteFounder);

module.exports = resourcesRouter;