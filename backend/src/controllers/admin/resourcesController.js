const Resources = require('../../models/resourcesModel');

const fetchResources = async (req, res) => {
    try {
        const resources = await Resources.find();
        res.status(200).json({status: true, resources: resources});
    } catch (error) {
        res.status(500).json({status: false, message: 'Failed to fetch resources' });
    }
};

const updateResources = async (req, res) => {
    try {
        const {updatedData} = req.body;
        await Resources.findOneAndUpdate({ _id: updatedData._id }, updatedData, { new: true });
        return res.status(200).json({status: true, message: 'Resource updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: false, message: 'Internal Server Error' });
    }
};

const addFounder = async (req, res) => {
    try {
        const {name,position,message} = req.body;
        const resource = await Resources.findOne({ _id: "678c87362f6aa9943b3703bc" });
        if (!resource) {
            return res.status(404).json({status: false, message: 'Resource not found' });
        }
        const imageUrl = req.file.filename;
        resource.teams.push({name,imageUrl,position,message});
        await resource.save();
        return res.status(200).json({status: true, message: 'Resource updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({status: false, message: 'Internal Server Error' });
    }
};

const deleteFounder = async (req, res) => {
    try {
        const id = req.params.id;

        // Assuming 'id' is a string but the MongoDB _id is an ObjectId.
        const resource = await Resources.findOne({ _id: "678c87362f6aa9943b3703bc" });
        
        if (!resource) {
            return res.status(404).json({ status: false, message: 'Resource not found' });
        }

        // Check if the founder exists in the 'teams' array
        const founderExists = resource.teams.some((founder) => founder._id.toString() === id);

        if (!founderExists) {
            return res.status(404).json({ status: false, message: 'Founder not found in resource' });
        }

        // Delete the founder by filtering out their ID from the 'teams' array
        resource.teams = resource.teams.filter((founder) => founder._id.toString() !== id);

        // Save the updated resource document
        await resource.save();

        return res.status(200).json({ status: true, message: 'Founder deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


module.exports = {deleteFounder,addFounder, updateResources,fetchResources };