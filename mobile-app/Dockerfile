FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 8081
ENV EXPO_NO_TELEMETRY=1
ENV CI=1
ENV EXPO_PUBLIC_API_URL=http://host.docker.internal:3000
CMD ["npx", "expo", "start", "--port", "8081", "--host", "lan"]
