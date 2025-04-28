import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



export const isValidGoogleSheetsUrl = (url) => {
  const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//;
  return regex.test(url);
};

export const importTasksFromUrl = async (url) => {
  try {
    const sheetId = url.match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\//)[1];
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${process.env.GOOGLE_SHEET_API_KEY}`;
    const response = await axios.get(apiUrl);
    const data = response.data.values;

    const tasks = data.slice(1).map(row => ({
      title: row[0],
      description: row[1],
      dueDate: new Date(row[2]),
      priority: row[3],
      status: row[4]
    }));

    return tasks;
  } catch (error) {
    throw new Error('Failed to fetch Google Sheets data', error);
  }
};
