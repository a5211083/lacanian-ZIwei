const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// --- 路径逻辑修复 ---
// __dirname 是 server-api 文件夹
// ../ 是项目根目录
// 这里的 'dist' 是 React 默认打包后的文件夹名，如果你的叫 'build'，请修改此处
const rootPath = path.resolve(__dirname, '../'); 
const distPath = path.join(rootPath, 'dist'); 

// 1. 静态资源处理
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log("✅ 成功关联前端静态目录:", distPath);
} else {
    // 如果根目录下没有 dist，尝试直接把根目录作为静态资源（针对某些特殊布局）
    app.use(express.static(rootPath));
    console.warn("⚠️ 未找到 dist 文件夹，已将根目录作为静态资源路径");
}

// 2. AI 接口 (保持不变)
app.post('/api/glm', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: '缺少 prompt 参数' });

        const apiKey = process.env.GLM_API_KEY;
        if (!apiKey) return res.status(500).json({ error: '服务器未配置 API Key' });

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
                stream: true
            })
        });

        if (!response.ok) {
            const errorDetail = await response.text();
            return res.status(response.status).json({ error: 'AI 平台返回错误', detail: errorDetail });
        }

        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const reader = response.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
        }
        res.end();

    } catch (err) {
        console.error("服务器错误:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: '内部错误', message: err.message });
        }
    }
});

// 3. 兜底路由修复：返回前端的 index.html
app.get('*', (req, res) => {
    // 优先尝试找 dist/index.html，找不到则找 根目录/index.html
    const distIndex = path.join(distPath, 'index.html');
    const rootIndex = path.join(rootPath, 'index.html');

    if (fs.existsSync(distIndex)) {
        res.sendFile(distIndex);
    } else if (fs.existsSync(rootIndex)) {
        res.sendFile(rootIndex);
    } else {
        res.status(404).send("未找到 index.html。请确保你已经运行了 npm run build 并且文件位置正确。");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 后端已启动：端口 ${PORT}`);
    console.log(`📁 当前后端文件位置: ${__dirname}`);
    console.log(`🌐 尝试寻找前端位置: ${distPath}`);
});