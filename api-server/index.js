const express = require('express');  
const cors = require('cors');  
const app = express();  
app.use(cors());  
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb' }));  
// 全局错误处理  
process.on('uncaughtException', (err) => {  
    console.error('❌ 未捕获的异常:', err);  
});  
process.on('unhandledRejection', (reason, promise) => {  
    console.error('❌ 未处理的 Promise 拒绝:', reason);  
});  
// 设置请求超时（30秒）  
app.use((req, res, next) => {  
    req.setTimeout(30000);  
    res.setTimeout(30000);  
    next();  
});  
// 健康检查端点  
app.get('/health', (req, res) => {  
    res.json({ status: 'ok', timestamp: new Date().toISOString() });  
});  
// AI 接口  
app.post('/api/glm', async (req, res) => {  
    const requestId = Math.random().toString(36).substring(7);  
    console.log(`[${requestId}] 📨 收到 /api/glm 请求`);  
      
    try {  
        const { prompt } = req.body;  
        if (!prompt) {  
            console.log(`[${requestId}] ⚠️ 缺少 prompt 参数`);  
            return res.status(400).json({ error: '缺少 prompt 参数' });  
        }  
        const apiKey = process.env.GLM_API_KEY;  
        if (!apiKey) {  
            console.error(`[${requestId}] ❌ 未配置 API Key`);  
            return res.status(500).json({ error: '服务器未配置 API Key' });  
        }  
        console.log(`[${requestId}] 🔑 API Key 已配置`);  
        // 设置响应头  
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');  
        res.setHeader('Cache-Control', 'no-cache');  
        res.setHeader('Connection', 'keep-alive');  
        res.setHeader('X-Accel-Buffering', 'no');  
        // 创建超时定时器  
        let timeoutId = setTimeout(() => {  
            console.warn(`[${requestId}] ⏱️ 请求超时（25秒）`);  
            if (!res.headersSent) {  
                res.status(504).json({ error: '请求超时' });  
            } else {  
                res.end();  
            }  
        }, 25000);  
        try {  
            console.log(`[${requestId}] 🌐 正在调用 SiliconFlow API...`);  
              
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
            console.log(`[${requestId}] 📊 API 响应状态: ${response.status}`);  
            if (!response.ok) {  
                clearTimeout(timeoutId);  
                const errorDetail = await response.text();  
                console.error(`[${requestId}] ❌ API 错误: ${response.status} - ${errorDetail.substring(0, 200)}`);  
                return res.status(response.status).json({   
                    error: 'AI 平台返回错误',   
                    detail: errorDetail.substring(0, 500)  
                });  
            }  
            console.log(`[${requestId}] ✅ API 连接成功，开始流式传输`);  
            // 处理流式响应  
            let chunkCount = 0;  
            response.body  
                .on('data', (chunk) => {  
                    chunkCount++;  
                    if (chunkCount % 10 === 0) {  
                        console.log(`[${requestId}] 📦 已接收 ${chunkCount} 个数据块`);  
                    }  
                    res.write(chunk);  
                })  
                .on('end', () => {  
                    clearTimeout(timeoutId);  
                    console.log(`[${requestId}] ✅ 流式传输完成，共 ${chunkCount} 个数据块`);  
                    res.end();  
                })  
                .on('error', (err) => {  
                    clearTimeout(timeoutId);  
                    console.error(`[${requestId}] ❌ 流处理错误:`, err.message);  
                    if (!res.headersSent) {  
                        res.status(500).json({ error: '流处理失败', message: err.message });  
                    } else {  
                        res.end();  
                    }  
                });  
            // 监听客户端断开连接  
            res.on('close', () => {  
                clearTimeout(timeoutId);  
                console.log(`[${requestId}] 🔌 客户端已断开连接`);  
            });  
        } catch (fetchErr) {  
            clearTimeout(timeoutId);  
            console.error(`[${requestId}] ❌ Fetch 错误:`, fetchErr.message);  
            if (!res.headersSent) {  
                res.status(500).json({ error: '内部错误', message: fetchErr.message });  
            } else {  
                res.end();  
            }  
        }  
    } catch (err) {  
        console.error(`[${requestId}] ❌ 服务器错误:`, err.message);  
        if (!res.headersSent) {  
            res.status(500).json({ error: '内部错误', message: err.message });  
        }  
    }  
});  
const PORT = process.env.PORT || 8080;  
app.listen(PORT, '0.0.0.0', () => {  
    console.log(`🚀 后端已启动：端口 ${PORT}`);  
    console.log(`✅ 服务已准备好接收请求`);  
});  
