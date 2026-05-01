# ১. বেস ইমেজ হিসেবে Node.js ২০ ব্যবহার করছি
FROM node:20

# ২. সিস্টেম লেভেলের টুলস (qpdf) ইনস্টল করা
# এটি আপনার 'qpdf: not found' এররটি চিরতরে দূর করবে
RUN apt-get update && apt-get install -y \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

# ৩. অ্যাপ ডিরেক্টরি তৈরি
WORKDIR /app

# ৪. রুট এবং সার্ভার ফোল্ডারের ডিপেন্ডেন্সি কপি ও ইনস্টল করা
# আমরা package.json ফাইলগুলো আগে কপি করছি যাতে লেয়ার ক্যাশিং সুবিধা পাওয়া যায়
COPY package*.json ./
RUN npm install

# যদি আপনার প্রজেক্টে আলাদা 'server' ফোল্ডার থাকে, তবে নিচের লাইনগুলো আনকমেন্ট করুন
# COPY server/package*.json ./server/
# RUN cd server && npm install

# ৫. প্রোজেক্টের সব ফাইল কপি করা
COPY . .

# ৬. আপলোড ফোল্ডার তৈরি এবং পারমিশন সেট করা
# এটি ফাইল সেভ করার সময় 'Permission Denied' এরর আটকাবে
RUN mkdir -p uploads && chmod 777 uploads

# ৭. ফ্রন্টএন্ড বিল্ড করা (যদি আপনার প্রোজেক্টে বিল্ড স্ক্রিপ্ট থাকে)
RUN npm run build

# ৮. পোর্ট এক্সপোজ করা (Render-এর জন্য ডিফল্ট ১০০০০)
EXPOSE 10000

# ৯. সার্ভার স্টার্ট কমান্ড
# আপনার কোড অনুযায়ী পাথটি সঠিক কিনা নিশ্চিত করুন (server/server.js নাকি শুধু server.js)
CMD ["node", "server/server.js"]