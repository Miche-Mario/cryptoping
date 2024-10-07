import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK using environment variables
const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

// Read the Firestore rules file
const rules = readFileSync(join(__dirname, '../firestore.rules'), 'utf8');

// Deploy the rules
async function deployRules() {
  try {
    await admin.securityRules().setRulesFromSource('firestore.rules', rules);
    console.log('Firestore security rules updated successfully');
  } catch (error) {
    console.error('Error updating Firestore security rules:', error);
  } finally {
    await app.delete();
  }
}

deployRules();