const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    'pattern': 'get',
    'alias': ['download', 'dl'],
    'desc': 'Download and share files',
    'category': 'tools',
    'use': '.get <command_name>',
    'filename': __filename
}, async (m, sock, msg, { args, reply }) => {
    try {
        if (!msg.message) {
            return reply('❌ No message found.');
        }
        
        if (!msg.message.quoted) {
            return reply('❌ Please reply to a message with a file.');
        }
        
        const commandName = msg.message.quoted.text();
        const command = commands.find(cmd => 
            cmd.name === commandName || (cmd.alias && cmd.alias.includes(commandName))
        );
        
        if (!command) {
            return reply('❌ Command not found.');
        }
        
        const filePath = command.filename;
        const fileBuffer = fs.readFileSync(filePath);
        let fileContent = fileBuffer.toString();
        
        // Truncate if file is too large
        if (fileContent.length > 4000) {
            fileContent = fileContent.substring(0, 4000) + '...';
        }
        
        const messageText = `📁 *File Content:* ${filePath}\n\n${fileContent}`;
        
        await m.sendMessage(msg.remoteJid, {
            'text': messageText,
            'contextInfo': {
                'mentionedJid': [msg.sender],
                'forwardingScore': 999,
                'isForwarded': false,
                'externalAdReply': {
                    'title': 'File Content',
                    'body': 'Command file preview',
                    'mediaType': 1
                }
            }
        }, { 'quoted': sock });
        
        const fileName = `${commandName}.js`;
        const tempFilePath = path.join(__dirname, fileName);
        
        fs.writeFileSync(tempFilePath, fileBuffer);
        
        await m.sendMessage(msg.remoteJid, {
            'document': fs.readFileSync(tempFilePath),
            'mimetype': 'application/javascript',
            'fileName': fileName
        }, { 'quoted': sock });
        
        fs.unlinkSync(tempFilePath);
        
    } catch (error) {
        console.error('Error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});