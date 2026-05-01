FROM node:18

# Install qpdf
RUN apt-get update && apt-get install -y qpdf

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server/server.js"]