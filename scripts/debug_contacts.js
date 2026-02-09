
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
const SEARCH_FRAGMENT = '97401268338833';

console.log(`🔍 Debugging CONTACTS for Instance: ${INSTANCE}`);
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

        const json = await res.json();
        return json;
    } catch (e) {
        console.error(`❌ Request Error ${endpoint}:`, e.message);
        return null;
    }
}

async function run() {
    console.log('📦 Fetching contacts...');
    const data = await request(`chat/findContacts/${INSTANCE}`, 'GET');

    const contacts = Array.isArray(data) ? data : (data?.records || []);
    console.log(`✅ Found ${contacts.length} contacts.`);

    let found = false;
    contacts.forEach(c => {
        const json = JSON.stringify(c);
        if (json.includes('974') || json.includes('rosangela')) {
            console.log('🎯 MATCH FOUND in Contact:', json);
            found = true;
        }
    });

    if (!found) {
        console.log('❌ No contact found matching fragment or name "rosangela".');
    }
}

run();
