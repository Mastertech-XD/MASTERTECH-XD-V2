const fetch = require('node-fetch');
const FormData = require('form-data');
const { cmd } = require('../command');

cmd({
    'pattern': 'hd',
    'alias': ['remini', 'enhance'],
    'desc': 'Enhance photo quality using AI (like Remini)',
    'category': 'tools',
    'filename': __filename,
    'use': '.hd (reply to an image)'
}, async (m, sock, msg, { reply }) => {
    await m.sendMessage(sock.key.remoteJid, {
        'react': {
            'text': '🖨️',
            'key': sock.key
        }
    });
    
    try {
        let message = sock.message || sock;
        let mimetype = (message.msg || message).mimetype || message.mime || message.mediaType || '';
        
        if (!mimetype) throw '📷 Please send or reply to an image first.';
        if (!/image\/(jpe?g|png)/.test(mimetype)) throw '❌ The format *' + mimetype + '* is not supported.';
        
        let buffer = await message.download?.();
        if (!buffer) throw '❌ Failed to download the image.';
        
        const imageUrl = await uploadToCatbox(buffer);
        const apiUrl = 'https://zenz.biz.id/tools/remini?url=' + encodeURIComponent(imageUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw '❌ Error accessing the Remini API.';
        
        const result = await response.json();
        if (!result.status || !result.result?.result_url) throw '❌ Invalid response from API.';
        
        const enhancedImage = await fetch(result.result.result_url).then(res => res.buffer());
        if (!enhancedImage || enhancedImage.length === 0) throw '❌ Failed to fetch enhanced image.';
        
        await m.sendMessage(sock.key.remoteJid, {
            'image': enhancedImage,
            'caption': '> *💫 Image enhanced successfully!* *Powered by DEV ᴍᴀsᴛᴇʀᴘᴇᴀᴄᴇ ᴇʟɪᴛᴇ*'
        }, { 'quoted': sock });
        
    } catch (error) {
        await m.sendMessage(sock.key.remoteJid, {
            'react': {
                'text': '❌',
                'key': sock.key
            }
        });
        console.error(error);
        reply(typeof error === 'string' ? error : '❌ An error occurred. Please try again later.');
    }
});

async function uploadToCatbox(buffer) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', buffer, 'image.jpg');
    
    const response = await fetch('https://catbox.moe/user/api.php', {
        'method': 'POST',
        'body': form
    });
    
    const result = await response.text();
    if (!result.startsWith('https://')) throw '❌ Error while uploading image to Catbox.';
    
    return result.trim();
}