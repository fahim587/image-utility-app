# ১. বেস ইমেজ
FROM node:18-bullseye

# ২. qpdf ইনস্টল করা (এটি অলরেডি কাজ করছে আপনার লগে দেখা যাচ্ছে)
RUN apt-get update && apt-get install -y qpdf && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ৩. প্যাকেজ ফাইল কপি (নিশ্চিত করুন আপনার package.json কোথায় আছে)
COPY package*.json ./
RUN npm install

# ৪. সব ফাইল কপি
COPY . .

# ৫. পারমিশন ঠিক করা
RUN mkdir -p uploads && chmod 777 uploads

# ৬. রান কমান্ড (সবচেয়ে গুরুত্বপূর্ণ)
# যদি server.js ফাইলটি সরাসরি মেইন ফোল্ডারে না থাকে, তবে সঠিক পাথ দিন। 
# যেমন: CMD ["node", "src/server.js"] অথবা আপনার ফোল্ডার অনুযায়ী।
CMD ["node", "server/server.js"]