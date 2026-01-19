FROM node:18-slim
LABEL "language"="nodejs"
LABEL "framework"="express"

WORKDIR /app

# 复制 package.json 和安装依赖
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install

# 复制所有源代码
COPY . .

# 构建前端 React 应用
RUN npm run build

# 启动后端服务
EXPOSE 8080
CMD ["npm", "start"]