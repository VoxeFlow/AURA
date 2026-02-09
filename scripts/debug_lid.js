
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

console.log(`🔍 Debugging ALL CHATS for Instance: ${INSTANCE}`);
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
    console.log('📦 Fetching chats...');
    const data = await request(`chat/findChats/${INSTANCE}`, 'POST', {});

    const chats = Array.isArray(data) ? data : (data?.records || data?.chats || []);
    console.log(`✅ Found ${chats.length} chats.`);

    chats.forEach(c => {
        const id = c.id || c.jid || c.remoteJid;
        const name = c.name || c.pushName || c.verifiedName || "Unknown";
        console.log(`- [${name}] ID: ${id}`);

        // Also dump metadata
        if (name.toLowerCase().includes('rosangela')) {
            console.log('🎯 TARGET METADATA DUMP:');
            console.log(JSON.stringify(c, null, 2));
        }
    });
}

run();
