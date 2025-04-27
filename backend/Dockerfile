FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 创建上传目录
RUN mkdir -p uploads && chmod 777 uploads
EXPOSE 3000
CMD ["node", "server.js"]