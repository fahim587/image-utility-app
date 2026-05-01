# ১. বেস ইমেজ সেট করা
FROM node:18-bullseye

# ২. কিউপিডিএফ (qpdf) ইনস্টল করা - এই লাইনটিই আপনার লগে missing ছিল
RUN apt-get update && \
    apt-get install -y qpdf && \
    rm -rf /var/lib/apt/lists/*

# ৩. ওয়ার্কিং ডিরেক্টরি
WORKDIR /app

# ৪. ডিপেন্ডেন্সি ইনস্টল করা
COPY package*.json ./
RUN npm install

# ৫. সব কোড কপি করা
COPY . .

# ৬. ফোল্ডার পারমিশন ঠিক করা
RUN mkdir -p uploads && chmod 777 uploads

# ৭. পোর্ট এবং রান কমান্ড
EXPOSE 10000
CMD ["node", "server.js"]