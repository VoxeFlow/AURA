
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
// The LID found in previous step
const TARGET_LID = '97401268338833@lid';

console.log(`🔍 Debugging MESSAGES for LID: ${TARGET_LID}`);
console.log(`🌐 URL: ${API_URL}`);

async function request(endpoint, method = 'GET', body = null) {
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

        if (!res.ok) {
            console.error(`❌ HTTP Error ${res.status}: ${res.statusText}`);
            return null;
        }

        return await res.json();
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('📦 Fetching messages...');
    const data = await request(`chat/findMessages/${INSTANCE}`, 'POST', {
        where: {
            key: {
                remoteJid: TARGET_LID
            }
        },
        limit: 10
    });

    const messages = Array.isArray(data) ? data : (data?.messages?.records || data?.records || data?.messages || []);
    console.log(`✅ Found ${messages.length} messages.`);

    messages.forEach((m, i) => {
        const participant = m.key?.participant || m.participant;
        console.log(`[${i}] Participant: ${participant} | FromMe: ${m.key?.fromMe}`);
        if (participant) console.log(`   -> Found Participant: ${participant}`);
    });

    if (messages.length === 0) {
        console.log('⚠️ No messages found. Trying fallback scan...');
        // Try searching for messages where 'remoteJid' is the JID but maybe without @lid? (unlikely)
    }
}

run();
