// debug-ui.js
(function () {
  console.log("✅ debug-ui.js chargé");

  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(l => l.getAttribute("href"))
    .filter(Boolean);

  console.log("🧩 <link rel=stylesheet> détectés :", links);

  if (links.length === 0) {
    console.error("❌ Aucun <link rel=stylesheet> dans le <head>");
  }

  Promise.all(
    links.map(href =>
      fetch(href, { method: "GET" })
        .then(r => ({ href, ok: r.ok, status: r.status }))
        .catch(e => ({ href, ok: false, status: "ERR", error: String(e) }))
    )
  ).then(results => {
    console.table(results);
  });

  document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded OK");
  });
})();
