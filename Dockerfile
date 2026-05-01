FROM node:18-bullseye

# Install qpdf
RUN apt-get update && apt-get install -y qpdf

# App directory
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]