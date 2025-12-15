// debug-ui.js
(function () {
  console.log("✅ debug-ui.js chargé");

  const styles = [...document.styleSheets].map(s => s.href).filter(Boolean);
  console.log("📄 Stylesheets détectés :", styles);

  if (styles.length === 0) {
    console.error("❌ AUCUN CSS CHARGÉ");
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded OK");
    document.body.style.outline = "5px solid red";
  });
})();
