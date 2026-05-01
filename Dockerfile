# Base image ব্যবহার করুন (যেমন node:18 বা node:20)
FROM node:18

# সিস্টেম প্যাকেজ আপডেট করুন এবং qpdf ইনস্টল করুন
RUN apt-get update && apt-get install -y qpdf && rm -rf /var/lib/apt/lists/*

# কাজের ডিরেক্টরি সেট করুন
WORKDIR /app

# প্যাকেজ ফাইল কপি করুন এবং ইনস্টল করুন
COPY package*.json ./
RUN npm install

# বাকি কোড কপি করুন
COPY . .

# অ্যাপ্লিকেশন রান করুন
CMD ["node", "server/server.js"]