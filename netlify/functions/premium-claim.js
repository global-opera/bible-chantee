const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  try {
    const token =
      event.queryStringParameters?.premium_token ||
      event.queryStringParameters?.token;

    if (!token) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "missing_token" }) };
    }

    const secret = process.env.PREMIUM_JWT_SECRET;
    if (!secret) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "missing_secret" }) };
    }

    const payload = jwt.verify(token, secret);

    if (!payload || payload.premium !== true) {
      return { statusCode: 403, body: JSON.stringify({ ok: false, error: "not_premium" }) };
    }

    const maxAge = 60 * 60 * 24 * 365;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": [
          `bc_premium=1; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`,
          `bc_premium_uid=${encodeURIComponent(payload.sub || "user")}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`,
        ].join(", "),
      },
      body: JSON.stringify({ ok: true, premium: true }),
    };
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: "invalid_or_expired_token" }) };
  }
};
