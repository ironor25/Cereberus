// feedbackRouter.ts
import express, { Request, Response, Router } from 'express';
import { google } from 'googleapis';
import dotenv from "dotenv";
dotenv.config()

const feedbackFormrouter: Router = express.Router();

// Define an interface for the expected request body
interface FeedbackRequestBody {
  name: string;
  email: string;
  message: string;
}

// --- Configuration for Google Sheets API ---
// IMPORTANT: For Render deployment, configure these as environment variables
// in your Render service dashboard.

// Google Sheet details from environment variables
const SPREADSHEET_ID: string | undefined = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME: string | undefined = process.env.GOOGLE_SHEETS_SHEET_NAME;

// Google Service Account Credentials from environment variables
const GOOGLE_CLIENT_EMAIL: string | undefined = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY: string | undefined = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined; // Replace \\n with \n if storing as a single string
const GOOGLE_PROJECT_ID: string | undefined = process.env.GOOGLE_PROJECT_ID;

const SCOPES: string[] = ['https://www.googleapis.com/auth/spreadsheets'];
 
// Check if essential environment variables are set
if (!SPREADSHEET_ID || !SHEET_NAME || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_PROJECT_ID) {
  console.error('Critical Google Sheets environment variables are missing.');
  console.error('Please ensure GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SHEETS_SHEET_NAME, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_PROJECT_ID are set.');
  // In a real application, you might want to gracefully exit or disable this functionality
  // process.exit(1);
}

// Authenticate with Google Sheets API using environment variables
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
    project_id: GOOGLE_PROJECT_ID,
  },
  scopes: SCOPES,
});

/**
 * POST /send-feedback
 * Handles incoming feedback data and appends it to a Google Sheet.
 * Expected JSON body:
 * {
 * "name": "John Doe",
 * "email": "john.doe@example.com",
 * "id": "user123",
 * "message": "This is a great product!"
 * }
 */
feedbackFormrouter.post('/send-feedback', async (req: any,res: any) => {
  try {
   
    // Check again inside the route handler, in case the server started without them
    if (!SPREADSHEET_ID || !SHEET_NAME || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_PROJECT_ID) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Google Sheets API credentials or sheet details are missing. Please check environment variables.'
      });
    }

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields: name, email, id, and message are all required.' });
    }

    const sheets = google.sheets({ version: 'v4', auth });

    const values: (string | number)[][] = [
      [name, email, message, new Date().toISOString()], // Add a timestamp for when the feedback was received
    ];

    const requestBody = {
      values,
    };

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `A:D`, // Assuming your sheet has columns for Name, Email, ID, Message, Timestamp
      valueInputOption: 'USER_ENTERED', // How the input data is interpreted (e.g., numbers parsed as numbers)
      requestBody,
    });

    if (response.status === 200) {
      console.log('Feedback successfully saved to Google Sheet.');
      res.status(200).json({ success: true, message: 'Feedback submitted successfully!' });
    } else {
      console.error('Failed to save feedback:', response.statusText);
      res.status(response.status).json({ success: false, message: 'Failed to submit feedback. Please try again later.' });
    }

  } catch (error: any) { // Use 'any' for the error type or a more specific error type if known
    console.error('Error sending feedback:', error.message);

    // Provide a generic error message for the user, while logging details internally
    let errorMessage = 'An unexpected server error occurred.';

    // Check if it's a specific Google API error
    if (error.code && error.errors && error.errors.length > 0) {
      errorMessage = `Google Sheets API Error: ${error.errors[0].message || error.message}`;
      console.error('Google API Error Details:', error.errors); // Log full details for debugging
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});

export default feedbackFormrouter; // Use export default for TypeScript
