
import fs from 'fs';
import path from 'path';

// Load env
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
const TEST_LID = '166996968784053@lid'; // Known problematic LID

console.log(`🔍 Debugging LID Resolution via Profile Picture`);
console.log(`🌐 URL: ${API_URL}`);
console.log(`🎯 Target: ${TEST_LID}`);

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
    console.log('🧪 Fetching Profile Picture...');
    const data = await request(`chat/fetchProfilePictureUrl/${INSTANCE}`, 'POST', {
        number: TEST_LID
    });

    console.log('📸 Response:', JSON.stringify(data, null, 2));

    if (data && (data.profilePictureUrl || data.url)) {
        const url = data.profilePictureUrl || data.url;
        console.log(`🔗 URL: ${url}`);

        // Regex to extract phone number from URL
        // Typically: https://pps.whatsapp.net/v/.../5531992957555_...jpg
        const match = url.match(/\/(\d{10,15})_/);
        if (match) {
            console.log(`✅ FOUND PHONE NUMBER IN URL: ${match[1]}`);
        } else {
            console.log('⚠️ Could not extract number from URL.');
        }
    } else {
        console.log('❌ No profile picture URL returned.');
    }
}

run();
