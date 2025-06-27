const User = require('../models/usersModels');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { oauth2client } = require('../utils/googleConfig');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASSWORD;


const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create a new user
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      otp: otp,
      isEmailVerified: false
    });

    await newUser.save();
    // Your SMTP configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
      auth: {
        user: SMTP_USER,  // Your email address
        pass: SMTP_PASS,  // Your email password (or use an app password if 2FA is enabled)
      },
    });

    // Email options
    const htmlCode = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header h1 {
      color: #2c3e50;
      font-size: 24px;
    }
    .otp-section {
      text-align: center;
      margin: 20px 0;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #e74c3c;
      letter-spacing: 5px;
    }
    .email-footer {
      text-align: center;
      margin-top: 30px;
      color: #7f8c8d;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #3498db;
      color: #fff;
      font-size: 16px;
      border-radius: 5px;
      text-decoration: none;
    }
    .button:hover {
      background-color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Email Verification</h1>
    </div>
    <p>Hello,</p>
    <p>Thank you for registering with us. To verify your email address, please use the following One-Time Password (OTP):</p>

    <div class="otp-section">
      <div class="otp">${otp}</div>
    </div>

    <p>This OTP will expire in 10 minutes. Please do not share this OTP with anyone.</p>

    <div class="email-footer">
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Thank you, <br> The My Turn India Team</p>
    </div>
  </div>
</body>
</html>
`;
    const mailOptions = {
      from: SMTP_USER,
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
        return res.status(201).json({
          success: true,
          message: 'User registered successfully'
        }
        );
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
}

const signin = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare the password
    const matchedPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchedPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (existingUser.isEmailVerified === false) {
      //OTP for email verification
      const otp = Math.floor(100000 + Math.random() * 900000);
      const userId = existingUser._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId, // The user's ID
        { otp: otp }, // The update operation
        { new: true } // Return the updated document
      );


      // Your SMTP configuration
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
        auth: {
          user: 'instanttricks15192@gmail.com',  // Your email address
          pass: 'cnfw ywsx savx nfgn',  // Your email password (or use an app password if 2FA is enabled)
        },
      });

      // Email options
      const htmlCode = `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header h1 {
      color: #2c3e50;
      font-size: 24px;
    }
    .otp-section {
      text-align: center;
      margin: 20px 0;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #e74c3c;
      letter-spacing: 5px;
    }
    .email-footer {
      text-align: center;
      margin-top: 30px;
      color: #7f8c8d;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #3498db;
      color: #fff;
      font-size: 16px;
      border-radius: 5px;
      text-decoration: none;
    }
    .button:hover {
      background-color: #2980b9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Email Verification</h1>
    </div>
    <p>Hello,</p>
    <p>Thank you for registering with us. To verify your email address, please use the following One-Time Password (OTP):</p>

    <div class="otp-section">
      <div class="otp">${otp}</div>
    </div>

    <p>This OTP will expire in 10 minutes. Please do not share this OTP with anyone.</p>

    <div class="email-footer">
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Thank you, <br> The My Turn India Team</p>
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
          const token = jwt.sign({ id: updatedUser._id, email: updatedUser.email, role: updatedUser.role }, process.env.SECRET_KEY);
          return res.status(200).json({
            success: true,
            message: 'OTP send successfully',
            user: updatedUser,
            token: token
          }
          );
        }
      });

    }
    else {
      const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY);
      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: existingUser,
        token: token
      }
      );
    }

  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
}

const verify_email = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the email is already registered
    const user = await User.findOne({ email: email, otp: otp });
    if (user) {
      user.isEmailVerified = true;
      await user.save();
      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        user: user,
        token: token
      });
    }
    else {
      return res.status(404).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
}

const reset_password_email_verification = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    // Check if the email is already registered
    const user = await User.findOne({ email: email });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp;
      await user.save();

      // Your SMTP configuration
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
        auth: {
          user: SMTP_USER,  // Your email address
          pass: SMTP_PASS,  // Your email password (or use an app password if 2FA is enabled)
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
    const user = await User.findOne({ email: email, otp: otp });
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
    }
    else {
      return res.status(404).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
}


const getUserDeatils = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
}

const google = async (req, res) => {
  try {
    const { code } = req.body;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const reponse = await oauth2client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=' + googleRes.tokens.access_token,
      method: 'GET',
    });
    const { email, name, picture } = reponse.data;
    const user = await User.findOne({ email });
    if (!user) {
      const createUser = await User.create({
        email: email,
        name: name,
        password: email,
        role: 'user',
        isEmailVerified: true,
        otp: Math.floor(100000 + Math.random() * 900000),
      });

      const token = jwt.sign({ id: createUser._id, email: createUser.email, role: createUser.role }, process.env.SECRET_KEY);
      return res.status(200).json({ status: true, message: 'User logged in successfully', user: createUser, token: token });
    }
    else {
      if (!user.isEmailVerified) {
        return res.status(400).json({ status: false, message: 'Please verify your email' });
      } else {
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
        return res.status(200).json({ status: true, message: 'User logged in successfully', user: user, token: token });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: 'Server error. Please try again later.' });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user) {
      user.profileImage = req.file.filename;
      await user.save();
      res.status(200).json({ success: true, message: 'Profile image uploaded successfully', fileName: req.file.filename });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.userId);
    if (user) {
      user.name = name;
      user.email = email;
      user.phone = phone;
      await user.save();
      res.status(200).json({ success: true, message: 'Profile updated successfully', user: user });
    }
    else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {

  }
};

const sendEmail = async (req, res) => {
  try {
    const { formData } = req.body;
    // Your SMTP configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or any SMTP service like 'yahoo', 'outlook', etc.
      auth: {
        user: SMTP_USER,  // Your email address
        pass: SMTP_PASS,  // Your email password (or use an app password if 2FA is enabled)
      },
    });

    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333333;
            font-size: 24px;
        }
        p {
            font-size: 16px;
            color: #555555;
        }
        .message-section {
            padding-top: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
        }
        .message-section h2 {
            font-size: 18px;
            color: #444444;
        }
        .footer {
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Contact Form Submission</h1>
        
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        
        <div class="message-section">
            <h2>Message:</h2>
            <p>${formData.message}</p>
        </div>

        <div class="footer">
            <p>Thank you for reaching out to us. We will get back to you as soon as possible.</p>
        </div>
    </div>
</body>
</html>
`;
    const mailOptions = {
      from: formData.email,
      to: "manishkumar16036@gmail.com",           // Recipient email address
      subject: "Contact Form Submission", // Subject of the email
      html: htmlCode,       // Plain text or HTML content
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ success: false, message: 'Error sending email' });
      }
      
    });
    res.status(200).json({ success: true, message: 'Email sent successfully'});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};



module.exports = { sendEmail, updateProfile, uploadProfileImage, google, signup, signin, verify_email, reset_password_email_verification, reset_password, getUserDeatils };