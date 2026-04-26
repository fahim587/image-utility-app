// middleware/checkUsage.js
export default function checkUsage(user) {
  const today = new Date().toDateString();
  if (user.lastUsageDate !== today) {
    user.aiUsageToday = 0;
    user.lastUsageDate = today;
  }

  if (user.plan === "free" && user.aiUsageToday >= 5) {
    throw new Error("Daily free AI limit reached");
  }
}