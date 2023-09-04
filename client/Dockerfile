FROM node:18-alpine as builder
WORKDIR /app
COPY ./package.json ./
RUN npm install 
COPY . .
RUN npm run build

FROM nginx
# sử dụng port này ở trên docker là 3000 của docker
EXPOSE 3000
# COPY <src-path> <destination-path>
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Sao chép tất cả dữ liệu trong app/build cho trang nginx đã cấu hình default ở root
COPY --from=builder /app/build /usr/share/nginx/html