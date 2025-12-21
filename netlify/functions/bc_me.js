const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  try {
    const uid = (event.queryStringParameters && event.queryStringParameters.uid) || "";
    if (!uid) return { statusCode: 400, body: JSON.stringify({ ok: false, error: "uid required" }) };

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing Supabase env vars" }) };
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from("bc_users")
      .select("uid,email,credits")
      .eq("uid", uid)
      .maybeSingle();

    if (error) return { statusCode: 500, body: JSON.stringify({ ok: false, error: error.message }) };

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, me: data || { uid, credits: 0 } })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
};
