FROM node:20-bullseye

RUN apt-get update && apt-get install -y qpdf && rm -rf /var/lib/apt/lists/*

# এটি Dockerfile এর ভেতর থাকবে
RUN apt-get update && apt-get install -y qpdf libreoffice && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install

COPY . .

RUN mkdir -p server/uploads && chmod 777 server/uploads

CMD ["node", "server/server.js"]