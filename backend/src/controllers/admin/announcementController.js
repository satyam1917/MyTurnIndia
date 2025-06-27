const Announcement = require('../../models/announcementModel');

const createAnnouncement = async (req, res) => {
    try {
        // Extracting the data from the request body
        const { title, description, date } = req.body;

        // Validate input data (can add more validation as needed)
        if (!title || !description || !date) {
            return res.status(400).json({ status: false, message: 'All fields are required' });
        }

        // Create a new announcement
        const newAnnouncement = new Announcement({
            title,
            description,
            date,
        });

        // Save the new announcement to the database
        await newAnnouncement.save();

        // Send a success response with the created announcement data
        res.status(201).json({
            status: true,
            message: 'Announcement created successfully',
            announcement: newAnnouncement,
        });
    } catch (error) {
        // Handle errors and send a response
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};
const getAllAnnouncements = async (req, res) => {
    try {
        // Fetch all announcements from the database
        const announcements = await Announcement.find();

        // Send a success response with the fetched announcements
        res.status(200).json({ status: true, announcements: announcements });
    } catch (error) {
        // Handle errors and send a response
        console.error(error);
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    try {

        // Extract the updated data from the request body
        const {announcementId, announcementData } = req.body;
        const title = announcementData.title;
        const description = announcementData.description;
        const date = announcementData.date;

        // Find the announcement by ID and update its fields
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            announcementId,
            { title, description, date },
            { new: true }
        );

        // Send a success response with the updated announcement data
        res.status(200).json({ status: true, message: 'Announcement updated successfully', announcement: updatedAnnouncement });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
}

const deleteAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.body;
        await Announcement.findByIdAndDelete(announcementId);
        res.status(200).json({ status: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
}






module.exports = { createAnnouncement, getAllAnnouncements, updateAnnouncement,deleteAnnouncement };