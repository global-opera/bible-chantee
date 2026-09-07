const { createClient } = require("@supabase/supabase-js");

// Audit du 2026-09-07 : cet endpoint renvoyait l'email et les credits de
// n'importe quel utilisateur a qui presentait son uid, sans aucune
// authentification, avec la cle service_role (donc RLS contournee).
// Il n'est appele par aucune page du site. Il est desormais :
//   1. ferme par defaut  -> sans la variable d'environnement BC_API_TOKEN, il
//      repond 404 comme s'il n'existait pas ;
//   2. protege par jeton -> en-tete x-bc-token obligatoire ;
//   3. sans donnee personnelle -> l'email n'est plus renvoye.
exports.handler = async (event) => {
  try {
    const expected = process.env.BC_API_TOKEN;
    if (!expected) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, error: "not_found" }) };
    }
    const provided = (event.headers && (event.headers["x-bc-token"] || event.headers["X-Bc-Token"])) || "";
    if (provided !== expected) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: "unauthorized" }) };
    }

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
      .select("uid,credits")
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
