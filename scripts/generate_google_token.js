
import { google } from 'googleapis';
import readline from 'readline';

// Instructions:
// 1. Run: npm install googleapis
// 2. Run: node scripts/generate_google_token.js
// 3. Paste Client ID and Client Secret when prompted.
// 4. Follow the URL, authorize, and paste the code.
// 5. Save the Refresh Token to your .env or Cloudflare Dashboard.

const SCOPES = ['https://www.googleapis.com/auth/contacts'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
    console.log('🔐 Google OAuth 2.0 Token Generator');
    console.log('------------------------------------');

    const clientId = await ask('Enter Client ID: ');
    const clientSecret = await ask('Enter Client Secret: ');

    if (!clientId || !clientSecret) {
        console.error('❌ Missing credentials.');
        process.exit(1);
    }

    const oAuth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground' // Redirect URI used in instructions
    );

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Crucial for Refresh Token
        scope: SCOPES,
        prompt: 'consent' // Force new Refresh Token
    });

    console.log('\n🔗 Authorization URL:', authUrl);
    console.log('\n👉 Open this URL in your browser, authorize the app, and you will be redirected to https://developers.google.com/oauthplayground');
    console.log('👉 Copy the "Authorization code" from the page (or URL parameter) and paste it below.');

    const code = await ask('\nEnter Authorization Code: ');

    try {
        const { tokens } = await oAuth2Client.getToken(code);

        console.log('\n✅ SUCCESS! Here are your tokens:');
        console.log('------------------------------------');
        console.log('ACCESS_TOKEN (Expire em 1h):');
        console.log(tokens.access_token);
        console.log('\n🔄 REFRESH_TOKEN (SAVE THIS! IT NEVER EXPIRES):');
        console.log(tokens.refresh_token);
        console.log('------------------------------------');

        if (!tokens.refresh_token) {
            console.warn('⚠️ No Refresh Token returned. Did you use an existing authorization? Try revoking access or using prompt=consent.');
        }

    } catch (error) {
        console.error('❌ Error retrieving tokens:', error.message);
    } finally {
        rl.close();
    }
}

main();
