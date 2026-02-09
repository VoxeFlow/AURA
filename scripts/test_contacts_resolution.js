import fetch from 'node-fetch';

const API_URL = 'https://api.voxeflow.com';
const API_KEY = 'Beatriz@CB650';
const INSTANCE = 'VoxeFlow';

async function diagnose() {
    console.log(`🔍 DIAGNOSING INSTANCE: ${INSTANCE}`);
    console.log(`🔑 API Key: ${API_KEY.substring(0, 3)}...`);

    try {
        // 1. Check Instance State
        console.log(`\n1️⃣ Checking Connection State...`);
        const stateResp = await fetch(`${API_URL}/instance/connectionState/${INSTANCE}`, {
            headers: { 'apikey': API_KEY }
        });

        if (stateResp.ok) {
            const stateData = await stateResp.json();
            console.log(`   State: ${JSON.stringify(stateData)}`);
        } else {
            console.error(`   ❌ Failed to get state: ${stateResp.status}`);
        }

        // 2. Fetch Contacts with verbose logging
        console.log(`\n2️⃣ Fetching Contacts...`);
        const contactsResp = await fetch(`${API_URL}/chat/findContacts/${INSTANCE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({})
        });

        if (contactsResp.ok) {
            const data = await contactsResp.json();
            const contacts = Array.isArray(data) ? data : (data.records || []);
            console.log(`   ✅ Contacts Found: ${contacts.length}`);
            if (contacts.length > 0) {
                console.log(`   Sample: ${JSON.stringify(contacts[0])}`);
            } else {
                console.warn(`   ⚠️ ZERO contacts found. This means the instance hasn't synced contacts or they are empty.`);
            }
        } else {
            console.error(`   ❌ Failed to fetch contacts: ${contactsResp.status}`);
            console.error(await contactsResp.text());
        }

        // 3. Compare with Chats
        console.log(`\n3️⃣ Fetching Chats...`);
        const chatsResp = await fetch(`${API_URL}/chat/findChats/${INSTANCE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': API_KEY
            },
            body: JSON.stringify({})
        });

        if (chatsResp.ok) {
            const chatsData = await chatsResp.json();
            const chats = Array.isArray(chatsData) ? chatsData : (chatsData.records || []);
            console.log(`   ✅ Chats Found: ${chats.length}`);

            // Check if any chat has a LID
            const lidChats = chats.filter(c => (c.id || c.jid || "").includes('@lid'));
            console.log(`   🆔 LID Chats count: ${lidChats.length}`);
            if (lidChats.length > 0) {
                console.log(`   Sample LID Chat: ${lidChats[0].id} - Name: ${lidChats[0].name || lidChats[0].pushName}`);
            }
        }

    } catch (e) {
        console.error('❌ CRITICAL EXECUTION ERROR:', e);
    }
}

diagnose();
