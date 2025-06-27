const admin = require('../models/adminModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the email is already registered
        const user = await admin.findOne({ email: email });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
                return res.status(200).json({
                    success: true,
                    message: 'Admin logged in successfully',
                    user: user,
                    token: token,
                });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if the email is already registered
        const existingUser = await admin.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new admin({
            name: name,
            email: email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        return res.status(200).json({ success: true, message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

const reset_password_email_verification = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        // Check if the email is already registered
        const user = await admin.findOne({ email: email });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            user.otp = otp;
            await user.save();
            // Your SMTP configuration
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
                auth: {
                    user: 'instanttricks15192@gmail.com',  // Your email address
                    pass: 'cnfw ywsx savx nfgn',  // Your email password (or use an app password if 2FA is enabled)
                },
            });

            const htmlCode = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333;
          }
          .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .email-header {
              text-align: center;
              margin-bottom: 20px;
          }
          .email-header img {
              width: 120px;
          }
          .email-body {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
          }
          .otp-code {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              text-align: center;
              margin: 20px 0;
          }
          .cta-button {
              display: inline-block;
              background-color: #007BFF;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
              width: 100%;
              max-width: 200px;
              margin: 0 auto;
              transition: background-color 0.3s;
          }
          .cta-button:hover {
              background-color: #0056b3;
          }
          .footer {
              font-size: 12px;
              color: #777;
              text-align: center;
              margin-top: 30px;
          }
          .footer a {
              color: #007BFF;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
  
      <div class="email-container">
          <div class="email-header">
              <img src="https://via.placeholder.com/150" alt="Your Company Logo">
          </div>
  
          <div class="email-body">
              <h2>Password Reset OTP Verification</h2>
              <p>Dear ${user.name},</p>
              <p>We have received a request to reset the password for your account. To proceed, please use the OTP code below:</p>
  
              <div class="otp-code">
                  ${otp}
              </div>
  
              <p>This code is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
  
  
          </div>
  
          <div class="footer">
              <p>Thank you for using our service!</p>
          </div>
      </div>
  
  </body>
  </html>
  `;
            const mailOptions = {
                from: 'instanttricks15192@gmail.com',
                to: email,           // Recipient email address
                subject: "Email OTP Verification", // Subject of the email
                html: htmlCode,       // Plain text or HTML content
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ success: false, message: 'Error sending email' });
                }
                else {

                    return res.status(200).json({
                        success: true,
                        message: 'OTP send successfully',
                    }
                    );
                }
            });
        }
        else {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

const reset_password = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        if (!email || !otp || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        // Check if the email is already registered
        const user = await admin.findOne({ email: email, otp: otp });
        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
            await user.save();
            const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
                  return res.status(200).json({
                     success: true,
                      message: 'Password reset successfully',
                      user: user,
                      token: token
                     });
            return res.status(200).json({ success: true, message: 'Password reset successfully' });
        }
        else {
            return res.status(404).json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
}

module.exports = { signup, signin, reset_password_email_verification, reset_password };