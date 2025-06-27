const Event = require('../../models/eventModels');
const User = require('../../models/usersModels');

const createPaidEvent = async (req, res) => {
  try {
    const { title, description, amount, date, location } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !amount) {
      return res.status(400).json({ status: false, message: 'All fields are required.' });
    }

    // Check if the amount is valid (should be greater than 0 for paid events)
    if (amount <= 0) {
      return res.status(400).json({ status: false, message: 'Amount should be greater than 0.' });
    }

    const banner = req.file.filename;

    //Create the new event
    const newEvent = new Event({
      title,
      description,
      banner,
      date,
      location,
      isPaid: true, // As this is a paid event
      amount,
    });

    // Save the event to the database
    await newEvent.save();

    // Respond with the newly created event
    return res.status(201).json({
      status: true,
      message: 'Paid event created successfully.',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating paid event:', error);
    return res.status(500).json({ status: false, message: 'Server error. Please try again later.' });
  }
};
const createUnpaidEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location) {
      return res.status(400).json({ status: false, message: 'All fields are required.' });
    }

    const banner = req.file.filename;

    //Create the new event
    const newEvent = new Event({
      title,
      description,
      banner,
      date,
      location,
      isPaid: false, // As this is a unpaid event
      amount: 0,
    });

    // Save the event to the database
    await newEvent.save();

    // Respond with the newly created event
    return res.status(201).json({
      status: true,
      message: 'Unpaid event created successfully.',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating unpaid event:', error);
    return res.status(500).json({ status: false, message: 'Server error. Please try again later.' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Fetch all events from the database and filter them to only include future events
    const events = await Event.find({
      date: { $gte: currentDate.toISOString() } // Filter events with date greater than or equal to current date
    });

    // Map the events to the required structure
    const formattedEvents = events.map(event => ({
      id: event._id.toString(),
      title: event.title,
      date: event.date,
      description: event.description,
      image: event.banner, // Assuming banner is the image URL
      type: event.isPaid ? 'paid' : 'unpaid',
      location: event.location,
      amount: event.isPaid ? event.amount : undefined, // Only include amount for paid events
      isPurchased: false
    }));

    // Send the response with the formatted events
    res.status(200).json({ status: true, events: formattedEvents, message: 'Future events fetched successfully.' });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ status: false, message: 'An error occurred while fetching events.' });
  }
};

const getEventsByType = async (req, res) => {
  const { paid } = req.query;
  try {
    const events = await Event.find({ isPaid: paid === 'true' });
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching events' });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting event' });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, banner, date, location, isPaid, amount } = req.body;

  try {
    const event = await Event.findByIdAndUpdate(id, { title, description, banner, date, location, isPaid, amount }, { new: true });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Error updating event' });
  }
};

const getEventsWithPurchasedTickets = async (req, res) => {
  try {
    const userId = req.userId;
    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch all events
    const events = await Event.find();

    // Format each event
    const formattedEvents = events.map((event) => {
      // Check if the event is purchased by the user
      const isPurchased = user.purchasedEvents.some(
        (purchasedEvent) => purchasedEvent.eventId.toString() === event._id.toString()
      );

      return {
        id: event._id.toString(),
        title: event.title,
        date: event.date,
        description: event.description,
        image: event.banner, // Assuming banner is the image URL
        type: event.isPaid ? 'paid' : 'unpaid',
        location: event.location,
        amount: event.isPaid ? event.amount : undefined, // Only include amount for paid events
        isPurchased: isPurchased, // Indicates if the event is purchased by the user
      };
    });

    return res.status(200).json({ status: true, events: formattedEvents, message: 'Events fetched successfully.' });

  } catch (error) {
    res.status(500).json({ status: false, message: 'An error occurred while fetching events.' });
    throw new Error('Error fetching events');
  }
};





module.exports = { createPaidEvent, createUnpaidEvent, getAllEvents, getEventsByType,deleteEvent,updateEvent,getEventsWithPurchasedTickets};