const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Transform } = require('stream');

const app = express();

app.use(cors());
app.use(express.json());

// 设置请求超时（30秒）
app.use((req, res, next) => {
    req.setTimeout(30000);
    res.setTimeout(30000);
    next();
});

// --- 路径逻辑修复 ---
const rootPath = path.resolve(__dirname, '../'); 
const distPath = path.join(rootPath, 'dist'); 

// 1. 静态资源处理
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    console.log("✅ 成功关联前端静态目录:", distPath);
} else {
    app.use(express.static(rootPath));
    console.warn("⚠️ 未找到 dist 文件夹，已将根目录作为静态资源路径");
}

// 2. AI 接口 - 改进版本
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

        // 设置响应头
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // 创建超时定时器
        const timeoutId = setTimeout(() => {
            if (!res.headersSent) {
                res.status(504).json({ error: '请求超时' });
            } else {
                res.end();
            }
        }, 25000); // 25秒超时

        try {
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
                clearTimeout(timeoutId);
                const errorDetail = await response.text();
                return res.status(response.status).json({ 
                    error: 'AI 平台返回错误', 
                    detail: errorDetail 
                });
            }

            // 使用 Transform Stream 处理流式数据
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    try {
                        this.push(chunk);
                        callback();
                    } catch (err) {
                        callback(err);
                    }
                }
            });

            // 处理流式响应
            response.body
                .pipe(transformStream)
                .on('data', (chunk) => {
                    res.write(chunk);
                })
                .on('end', () => {
                    clearTimeout(timeoutId);
                    res.end();
                })
                .on('error', (err) => {
                    clearTimeout(timeoutId);
                    console.error("流处理错误:", err);
                    if (!res.headersSent) {
                        res.status(500).json({ error: '流处理失败' });
                    } else {
                        res.end();
                    }
                });

            // 监听客户端断开连接
            res.on('close', () => {
                clearTimeout(timeoutId);
                transformStream.destroy();
            });

        } catch (fetchErr) {
            clearTimeout(timeoutId);
            console.error("Fetch 错误:", fetchErr);
            if (!res.headersSent) {
                res.status(500).json({ error: '内部错误', message: fetchErr.message });
            } else {
                res.end();
            }
        }

    } catch (err) {
        console.error("服务器错误:", err);
        if (!res.headersSent) {
            res.status(500).json({ error: '内部错误', message: err.message });
        }
    }
});

// 3. 兜底路由修复：返回前端的 index.html
app.get(/(.*)/, (req, res) => {  
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