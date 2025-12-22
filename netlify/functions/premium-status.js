exports.handler = async (event) => {
  const cookie = event.headers?.cookie || event.headers?.Cookie || "";
  const isPremium = /(?:^|;\s*)bc_premium=1(?:;|$)/.test(cookie);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({ premium: isPremium }),
  };
};
