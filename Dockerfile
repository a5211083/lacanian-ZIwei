FROM node:18-slim
WORKDIR /app

# 注意：这里路径要带上文件夹名 api-server/
COPY api-server/package.json ./
RUN npm install

# 复制 api-server 文件夹里的所有代码到容器
COPY api-server/ .

EXPOSE 3000
CMD ["node", "index.js"]