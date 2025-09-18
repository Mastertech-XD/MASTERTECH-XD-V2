const fetch = require('node-fetch');
const { cmd } = require('../command');

const pairCommand = {
    'pattern': 'pair',
    'alias': ['getpair', 'clonebot'],
    'desc': 'Get WhatsApp pairing code',
    'category': 'tools',
    'use': '.pair <phone_number>',
    'filename': __filename
};

cmd(pairCommand, async (m, sock, msg, { q, reply }) => {
    try {
        if (!q || !/^\d{8,15}$/.test(q)) {
            return await reply('❌ PHONE NUMBER is incorrect.\n\nEXAMPLE: `♡PAIR 254743727510`');
        }

        const response = await fetch('https://elite-master-pair.onrender.com/code?number=' + q);
        const result = await response.json();
        
        if (!result || !result.status) {
            return await reply('❌ Pairing Failed to retrieve pairing code.');
        }

        const pairingCode = result.code;
        
        await reply(
            ' *PAIRING CODE* for ' + q + ':\n\n' +
            '*PAIRING CODE*: ' + pairingCode +
            '\n\n*PLEASE WAIT WHILE SYNCING..*'
        );
        
        // Wait for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await reply(pairingCode);
        
    } catch (error) {
        console.error('❄️ AN error occurred:', error.message);
        await reply('❄️ AN error occurred during the pairing process.');
    }
});