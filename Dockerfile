FROM node:18-bullseye

# ১. qpdf ইনস্টল করা
RUN apt-get update && apt-get install -y qpdf && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ২. আপনার package.json যদি 'server' ফোল্ডারের ভেতরে থাকে
# তবে এখানে 'server/package*.json' দিন। 
# আর যদি মেইন ফোল্ডারে থাকে তবে নিচেরটা ঠিক আছে:
COPY package*.json ./
RUN npm install

# ৩. সব কোড কপি করা
COPY . .

# ৪. ফোল্ডার পারমিশন ঠিক করা
RUN mkdir -p uploads && chmod 777 uploads

# ৫. রান কমান্ড (সঠিক পাথ সহ)
# আপনার এরর লগ অনুযায়ী ফাইলটি 'server/server.js' এ আছে
CMD ["node", "server/server.js"]