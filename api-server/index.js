const express = require('express');
const cors = require('cors');
const app = express();

const path = require('path');

// 关键：将前端打包后的 dist 文件夹变为静态资源
// 假设你的 React 打包后叫 dist，并且 server 和 frontend 在同级目录
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 自动处理 CORS（包括 OPTIONS 预检请求），不需要再手写那一堆 Headers
app.use(cors());
app.use(express.json());

app.post('/api/glm', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: '缺少 prompt 参数' });
        }

        const apiKey = process.env.GLM_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: '服务器未配置 API Key' });
        }

        // 发起请求到硅基流动
        const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: "THUDM/GLM-Z1-9B-0414",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1024,
                stream: true // 开启流式输出
            })
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            return res.status(response.status).json({ error: 'AI 平台返回错误', detail: errorDetail });
        }

        // === 核心：流式响应的处理 ===
        // 设置响应头，告知浏览器这是一个流
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 使用 Node.js 的 ReadableStream 读取并转发数据
        const reader = response.body.getReader();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // 将每一块数据直接写入响应流
            res.write(value);
        }

        res.end(); // 传输结束

    } catch (err) {
        console.error("服务器内部错误:", err);
        res.status(500).json({ error: '服务器内部错误', message: err.message });
    }
});

// 关键：所有找不到的路径都指向 index.html（适配 React Router）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});