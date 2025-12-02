const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 使用你申请的高德天气API Key
const API_KEY = "8f6f8b82cb8d3f84268750c531393dc7";

// 天气图标映射（简单示例）
function getWeatherIcon(weather) {
  if (!weather) return "🌤️";
  if (weather.includes("晴")) return "☀️";
  if (weather.includes("云")) return "⛅";
  if (weather.includes("阴")) return "☁️";
  if (weather.includes("雨")) return "🌧️";
  if (weather.includes("雷")) return "⛈️";
  if (weather.includes("雪")) return "❄️";
  if (weather.includes("雾") || weather.includes("霾")) return "🌫️";
  return "🌤️";
}

// 主天气查询接口
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.json({
        success: false,
        message: "请输入城市名",
      });
    }

    console.log("🌤️ 收到天气查询请求，城市:", city);

    const url = `https://restapi.amap.com/v3/weather/weatherInfo`;
    const response = await axios.get(url, {
      params: {
        city: city,
        key: API_KEY,
        extensions: "base", // base: 实时天气; all: 预报
        output: "JSON",
      },
      timeout: 5000,
    });

    const data = response.data;
    if (data.status === "1" && data.lives && data.lives.length > 0) {
      const now = data.lives[0];
      const result = {
        success: true,
        city: now.city,
        temperature: now.temperature + "°C",
        weather: now.weather,
        weatherIcon: getWeatherIcon(now.weather),
        humidity: now.humidity + "%",
        wind: now.winddirection + " " + now.windpower + "级",
        windSpeed: now.reporttime ? "--" : "--",
        feelsLike: "--",
        pressure: "--",
        visibility: "--",
        updateTime: now.reporttime,
        source: "高德天气",
      };
      return res.json(result);
    } else {
      return res.json({
        success: false,
        message: `未获取到"${city}"的天气`,
      });
    }
  } catch (error) {
    console.error("❌ API请求失败:", error.message);
    res.json({
      success: false,
      message: `网络或API请求失败: ${error.message}`,
    });
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log("=".repeat(50));
  console.log("🌤 湖南天气查询服务 - 高德天气版");
  console.log("=".repeat(50));
  console.log(`📍 本地访问: http://localhost:3000`);
  console.log(`🔗 API测试: http://localhost:3000/api/weather?city=长沙`);
  console.log(`🔑 使用Key: ${API_KEY.substring(0, 8)}...`);
  console.log("=".repeat(50));
  console.log("✅ 服务器已启动！");
});
