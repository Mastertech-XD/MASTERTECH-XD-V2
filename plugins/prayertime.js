const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    name: 'weather',
    alias: ['w', 'cuaca', 'weather'],
    desc: 'Get weather information for a specific location',
    category: 'utilities',
    filename: __filename,
    use: 'Type .weather <location> to get weather information'
}, async (m, sock, msg, { args, reply }) => {
    try {
        const location = args.length > 0 ? args.join(' ') : 'Jakarta';
        const query = `${location}`;
        
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${config.OPENWEATHER_API_KEY}&units=metric`);
        
        if (response.status !== 200) {
            return reply('❌ Failed to fetch weather data. Please try again later.');
        }
        
        const weatherData = response.data;
        const main = weatherData.weather[0];
        const details = weatherData.main;
        const sys = weatherData.sys;
        
        let weatherInfo = `🌤️ *WEATHER INFORMATION* 🌤️\n\n`;
        weatherInfo += `📍 *Location:* ${weatherData.name}, ${sys.country}\n`;
        weatherInfo += `🌡️ *Temperature:* ${details.temp}°C\n`;
        weatherInfo += `🌡️ *Feels Like:* ${details.feels_like}°C\n`;
        weatherInfo += `📊 *Min/Max:* ${details.temp_min}°C / ${details.temp_max}°C\n`;
        weatherInfo += `💧 *Humidity:* ${details.humidity}%\n`;
        weatherInfo += `🌬️ *Wind Speed:* ${weatherData.wind.speed} m/s\n`;
        weatherInfo += `☁️ *Conditions:* ${main.main} (${main.description})\n`;
        weatherInfo += `📶 *Pressure:* ${details.pressure} hPa\n`;
        weatherInfo += `👁️ *Visibility:* ${weatherData.visibility / 1000} km\n\n`;
        
        const sunrise = sys.sunrise !== null ? `${new Date(sys.sunrise * 1000).toLocaleTimeString()}` : 'N/A';
        weatherInfo += `🌅 *Sunrise:* ${sunrise}\n`;
        
        await m.sendMessage(msg.remoteJid, {
            text: weatherInfo,
            contextInfo: {
                mentionedJid: [msg.sender],
                forwardingScore: 999,
                isForwarded: false,
                externalAdReply: {
                    title: 'Weather Information',
                    body: 'Powered by OpenWeatherMap',
                    mediaType: 1
                }
            }
        }, { quoted: msg });
        
        await m.sendMessage(msg.remoteJid, {
            image: { url: `http://openweathermap.org/img/wn/${main.icon}@2x.png` },
            caption: 'Weather Icon',
            mentions: []
        }, { quoted: msg });
        
    } catch (error) {
        console.error(error);
        reply('❌ An error occurred while fetching weather data.');
    }
});