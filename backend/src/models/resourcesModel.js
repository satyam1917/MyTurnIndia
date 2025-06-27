const mongoose = require('mongoose');


const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  position: { type: String, required: true },
  message: { type: String, required: true }, 
});

const ResourcesSchema = new mongoose.Schema(
  {
    whoWeAre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    mobile: { type: Number, required: true },
    instagram: { type: String, required: true },
    facebook: { type: String, required: true }, 
    twitter: { type: String, required: true },
    linkedin: { type: String, required: true },
    video: { type: String, required: true },
    teams: [memberSchema],
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields
);



const Resources = mongoose.model('Resources', ResourcesSchema);

module.exports = Resources;
