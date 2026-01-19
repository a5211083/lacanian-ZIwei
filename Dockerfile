FROM node:18-slim AS builder
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

# 最终运行阶段 - 只包含必要的文件
FROM node:18-slim

WORKDIR /app

# 从 builder 阶段复制 node_modules 和构建产物
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api-server ./api-server
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

CMD ["npm", "start"]