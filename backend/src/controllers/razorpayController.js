const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/usersModels");
const Order = require("../models/ordersModels");
const EventOrder = require("../models/eventOrderModels");
const Event = require("../models/eventModels");
const { stat } = require("fs");
const {format} = require("date-fns");
const nodemailer = require('nodemailer');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASSWORD;


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in paise (1 INR = 100 paise)
    const userId = req.userId;
    const options = {
      amount: amount * 100, // Razorpay expects the amount in paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    // Create order
    const order = await razorpay.orders.create(options);
    const user = await User.findById(userId);
    res.status(200).json({ order: order, user: user }); // Send order details to frontend
  } catch (error) {
    res.status(500).json({ error: error });
  }
};



const verifyPayment = async (req, res) => {
  const userId = req.userId;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, amount } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const newPurchasedCourse = {
      courseId: courseId,
      purchaseDate: new Date(),
      progress: 0,
    };
    const user = await User.findById(userId);
    user.purchasedCourses.push(newPurchasedCourse);
    await user.save();
    await Order.create({
      userId: userId,
      courseId: courseId,
      price: amount,
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      purchaseDate: new Date()
    });
    res.status(200).json({ success: true, message: "Payment verified and Course added" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

const verifyEventPayment = async (req, res) => {
  const userId = req.userId;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, amount } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    const newPurchasedEvent = {
      eventId: eventId,
      purchaseDate: new Date(),
    };

    //finding the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({status: false, message: "Event not found" });
    }

    // Update the user's purchasedEvents array
    const user = await User.findById(userId);
    user.purchasedEvents.push(newPurchasedEvent);
    await user.save();

    // Create an event order
    await EventOrder.create({
      userId: userId,
      eventId: eventId,
      price: amount,
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      purchaseDate: new Date()
    });
    // Your SMTP configuration
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
          auth: {
            user: SMTP_USER,  // Your email address
            pass: SMTP_PASS,  // Your email password (or use an app password if 2FA is enabled)
          },
        });
    
        // Email options
        const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Pass Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f3f3;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            max-width: 100px;
        }
        .ticket-details {
            text-align: center;
            padding: 20px;
            background-color: #f7f7f7;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .ticket-details h2 {
            color: #333333;
            margin: 0;
            font-size: 24px;
        }
        .ticket-info {
            margin-top: 15px;
            font-size: 16px;
            color: #555555;
        }
        .ticket-info p {
            margin: 5px 0;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            font-size: 16px;
            border-radius: 4px;
            text-decoration: none;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>

    <div class="email-container">
        <div class="header">
            <img src="https://via.placeholder.com/100" alt="Event Logo">
            <h1> ${event.title}</h1>
        </div>

        <div class="ticket-details">
            <h2>Your Event Pass</h2>
            <div class="ticket-info">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Event Date and Time:</strong> ${format(new Date(event.date), "MMMM dd, yyyy h:mm aa")}</p>
                <p><strong>Venue:</strong> ${event.location}</p>
                <p><strong>Ticked Id:</strong> ${user._id}</p>
            </div>
        </div>


        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:support@myturnindia.com">support@myturnindia.com</a>.</p>
            <p>&copy; 2025 My Turn India. All rights reserved.</p>
        </div>
    </div>

</body>
</html>
`;
        const mailOptions = {
          from: SMTP_USER,
          to: user.email,           // Recipient email address
          subject: "My Turn India - Event Pass", // Subject of the email
          html: htmlCode,       // Plain text or HTML content
        };
    
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).json({ success: false, message: 'Error sending email' });
          }
          
        });
    res.status(200).json({ success: true, message: "Payment verified and Course added" });
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  verifyEventPayment
};
