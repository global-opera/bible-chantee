const { createClient } = require("@supabase/supabase-js");

// Liste de domaines jetables à bloquer (optionnel)
const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.com',
  'throwaway.email', 'maildrop.cc', 'yopmail.com', 'sharklasers.com',
  'getnada.com', 'trashmail.com', 'temp-mail.org', 'fakeinbox.com'
];

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method Not Allowed" }) };
    }

    let { uid, email, ref } = JSON.parse(event.body || "{}");

    if (!uid || !email) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "uid/email required" }) };
    }

    // SÉCURITÉ: Normaliser l'email (trim + toLowerCase)
    email = email.trim().toLowerCase();

    // SÉCURITÉ: Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Email invalide" }) };
    }

    // SÉCURITÉ: Bloquer les domaines jetables (optionnel - décommentez pour activer)
    // const emailDomain = email.split('@')[1];
    // if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
    //   return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Domaine email non autorisé" }) };
    // }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Missing Supabase env vars" }) };
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    // 1) Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabase
      .from("users")
      .select("uid, email")
      .eq("uid", uid)
      .maybeSingle();

    // Si l'utilisateur existe déjà, on retourne ses infos sans modifier
    if (existingUser) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ok: true,
          awarded: false,
          me: existingUser,
          message: "Utilisateur déjà inscrit"
        })
      };
    }

    // 2) Créer le nouvel utilisateur (INSERT seulement, pas UPSERT)
    const { error: insertUserErr } = await supabase
      .from("users")
      .insert({ uid, email, credits: 0 });

    if (insertUserErr) {
      // Si erreur de duplicate email, renvoyer un message clair
      if (insertUserErr.code === '23505') { // PostgreSQL unique violation
        return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Email déjà utilisé" }) };
      }
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: insertUserErr.message }) };
    }

    // 2) Award referral ONCE: referred_uid is PK in bc_referrals
    let awarded = false;
    if (ref && ref !== uid) {
      const { error: insertRefErr } = await supabase
        .from("bc_referrals")
        .insert({ referred_uid: uid, referrer_uid: ref, awarded_credits: 10 });

      // If already referred (duplicate PK), ignore
      if (!insertRefErr) {
        // add 10 credits to referrer
        const { error: creditErr } = await supabase.rpc("bc_add_credits", {
          p_uid: ref,
          p_amount: 10
        });

        if (!creditErr) awarded = true;
      }
    }

    // 3) Return current user credits (optional)
    const { data: me } = await supabase
      .from("users")
      .select("uid,email,credits")
      .eq("uid", uid)
      .maybeSingle();

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, awarded, me: me || null })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
};
