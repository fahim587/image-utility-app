FROM node:18

# qpdf install
RUN apt-get update && apt-get install -y qpdf

# working dir
WORKDIR /app

# 👉 ONLY server dependencies install
COPY server/package*.json ./server/
RUN cd server && npm install

# copy all code
COPY . .

EXPOSE 10000

CMD ["node", "server/server.js"]