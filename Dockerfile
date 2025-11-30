# Step 1: Build the Vite app
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve using NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for NGINX
EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]
