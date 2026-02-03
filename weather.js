// weather.js - 天气预报功能
// 重要：请将 'YOUR_API_KEY_HERE' 替换为你从 OpenWeatherMap 获得的真实API密钥
const apiKey = 'fcbbedaa361a171a935a359755e7d32c';
const weatherInfoEl = document.getElementById('weatherInfo');

// 显示消息的辅助函数
function showMessage(msg, type = 'info') {
    const colors = {
        error: '#ffcccb',
        loading: '#ffffff',
        info: '#ffffff'
    };
    weatherInfoEl.innerHTML = `<p style="color: ${colors[type]}; text-align: center; margin: 20px 0;">${msg}</p>`;
}

// 根据城市名获取天气
async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        showMessage('请输入一个城市名。', 'error');
        return;
    }
    
    showMessage('正在查询中...', 'loading');
    
    try {
        // 1. 获取城市坐标
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            showMessage('未找到该城市，请检查拼写。', 'error');
            return;
        }
        
        const { lat, lon, name, country } = geoData[0];
        
        // 2. 获取详细天气数据
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        // 3. 显示天气信息
        displayWeather(weatherData, name, country);
        
    } catch (error) {
        console.error('获取天气失败:', error);
        showMessage('网络错误或API请求失败，请稍后重试。', 'error');
    }
}

// 根据用户位置获取天气
function getLocationWeather() {
    if (!navigator.geolocation) {
        showMessage('你的浏览器不支持地理位置功能。', 'error');
        return;
    }
    
    showMessage('正在获取你的位置...', 'loading');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`;
                const response = await fetch(url);
                const data = await response.json();
                displayWeather(data, data.name, data.sys.country);
            } catch (error) {
                console.error('根据位置获取天气失败:', error);
                showMessage('获取位置天气失败。', 'error');
            }
        },
        (error) => {
            console.error('获取位置失败:', error);
            let errorMsg = '无法获取你的位置。';
            if (error.code === error.PERMISSION_DENIED) {
                errorMsg = '位置访问权限被拒绝，请在浏览器设置中允许位置访问。';
            }
            showMessage(errorMsg, 'error');
        }
    );
}

// 在页面上显示天气信息
function displayWeather(data, cityName, countryCode) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const humidity = data.main.humidity;
    const windSpeed = (data.wind.speed * 3.6).toFixed(1); // 转换为公里/小时
    const feelsLike = Math.round(data.main.feels_like);
    
    weatherInfoEl.innerHTML = `
        <div style="text-align: center;">
            <h3 style="margin: 0 0 10px 0;">${cityName}, ${countryCode}</h3>
            <img src="${iconUrl}" alt="${description}" style="width: 80px; height: 80px; margin: 10px 0;">
            <p style="font-size: 2.5em; margin: 5px 0; font-weight: bold;">${temp}°C</p>
            <p style="margin: 5px 0;"><strong>${description}</strong></p>
            <p style="margin: 5px 0; font-size: 0.9em;">体感温度: ${feelsLike}°C</p>
            
            <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 0.9em;">
                <div>
                    <div style="font-size: 1.5em;">💧</div>
                    <div>湿度</div>
                    <div><strong>${humidity}%</strong></div>
                </div>
                <div>
                    <div style="font-size: 1.5em;">🌬️</div>
                    <div>风速</div>
                    <div><strong>${windSpeed} km/h</strong></div>
                </div>
            </div>
        </div>
    `;
}

// 页面加载时，如果用户之前查询过城市，可以尝试自动查询
document.addEventListener('DOMContentLoaded', function() {
    // 可以在这里添加任何页面加载时需要执行的代码
    const cityInput = document.getElementById('cityInput');
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
});