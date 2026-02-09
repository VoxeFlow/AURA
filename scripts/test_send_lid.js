
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
}

const API_URL = env.VITE_API_URL || 'https://api.voxeflow.com';
const API_KEY = env.VITE_API_KEY || 'Beatriz@CB650';
const INSTANCE = env.VITE_INSTANCE_NAME || 'VoxeFlow';
const TARGET_LID = '97401268338833@lid';

console.log(`🧪 Testing SEND to LID: ${TARGET_LID}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'POST', body = null) {
    const headers = {
        'Content-Type': 'application/json',
        'apikey': API_KEY
    };
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${baseUrl}/${cleanEndpoint}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        const json = await res.json();
        return { status: res.status, data: json };
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return { error: e.message };
    }
}

async function run() {
    // Test 1: Full LID
    console.log('\n--- Test 1: Full LID ---');
    const res1 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 1 (Full LID)",
        options: { delay: 0, linkPreview: false }
    });
    console.log('Result 1:', JSON.stringify(res1, null, 2));

    // Test 2: Stripped Suffix using number field
    const stripped = TARGET_LID.split('@')[0];
    console.log(`\n--- Test 2: Stripped Suffix (${stripped}) ---`);
    const res2 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: stripped,
        text: "Teste 2 (Stripped)",
        options: { delay: 0, linkPreview: false }
    });
    console.log('Result 2:', JSON.stringify(res2, null, 2));

    // Test 3: Using 'remoteJid' in options
    console.log('\n--- Test 3: RemoteJid Option ---');
    const res3 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: stripped, // Try stripped + remoteJid
        text: "Teste 3 (RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 3:', JSON.stringify(res3, null, 2));

    // Test 4: Full LID + RemoteJid
    console.log('\n--- Test 4: Full LID + RemoteJid ---');
    const res4 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 4 (Full + RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 4:', JSON.stringify(res4, null, 2));

    // Test 5: Number as NULL + RemoteJid (Maybe?)
    console.log('\n--- Test 5: Null Number + RemoteJid ---');
    const res5 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: null,
        text: "Teste 5 (Null + RemoteJid)",
        options: { delay: 0, linkPreview: false, remoteJid: TARGET_LID }
    });
    console.log('Result 5:', JSON.stringify(res5, null, 2));
    // Test 6: Quoted Reply (The Golden Ticket?)
    console.log('\n--- Test 6: Quoted Reply ---');
    const QUOTED_KEY = {
        remoteJid: TARGET_LID,
        id: 'AC7A78F72E8B5671745CEF28E71E8A18', // From debug_lid_msgs.js
        fromMe: false
    };
    // Construct minimal message object for quote
    const minimalQuote = {
        key: QUOTED_KEY,
        message: { conversation: "Original message text unknown" }
    };

    const res6 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: TARGET_LID,
        text: "Teste 6 (Reply/Quote)",
        options: {
            delay: 0,
            linkPreview: false,
            quoted: minimalQuote
        }
    });
    // Test 7: Send to UUID (Internal ID)
    const UUID = 'cmlfh92660kemoz4rzu9kx5d9'; // From debug_lid.js
    console.log('\n--- Test 7: Send to UUID ---');
    const res7 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: UUID,
        text: "Teste 7 (UUID)",
        options: { delay: 0 }
    });
    // Test 8: Group ID (Is it a group?)
    console.log('\n--- Test 8: Group ID ---');
    const GROUP_ID = '97401268338833@g.us';
    const res8 = await request(`message/sendText/${INSTANCE}`, 'POST', {
        number: GROUP_ID,
        text: "Teste 8 (Group)",
        options: { delay: 0 }
    });
    console.log('Result 8:', JSON.stringify(res8, null, 2));
}

run();
