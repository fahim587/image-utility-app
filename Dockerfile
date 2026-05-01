FROM node:20

# install qpdf
RUN apt-get update && apt-get install -y qpdf

WORKDIR /app

# install server deps
COPY server/package*.json ./server/
RUN cd server && npm install

# copy all files
COPY . .

# expose port
EXPOSE 10000

# start server
CMD ["node", "server/server.js"]