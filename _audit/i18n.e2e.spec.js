const { test, expect } = require("@playwright/test");

const BASE = "http://127.0.0.1:4177";

test("lecteur.html applies i18n in header", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push("[console.error] " + msg.text());
  });

  await page.goto(`${BASE}/lecteur.html?lang=EN`, { waitUntil: "domcontentloaded" });

  // Laisse le temps aux scripts async éventuels
  await page.waitForTimeout(400);

  // Selecteurs "robustes" : on cible les liens par data-i18n
  const navHelp = page.locator('[data-i18n="navHelp"]').first();
  const navNews = page.locator('[data-i18n="navNews"]').first();
  const navPromises = page.locator('[data-i18n="navPromises"]').first();

  await expect(navHelp).toBeVisible();
  await expect(navNews).toBeVisible();
  await expect(navPromises).toBeVisible();

  const tHelp = (await navHelp.innerText()).trim();
  const tNews = (await navNews.innerText()).trim();
  const tPromises = (await navPromises.innerText()).trim();

  // Si tes traductions EN sont différentes, adapte ici les chaînes attendues
  expect(tHelp).toMatch(/Help/i);
  expect(tNews).toMatch(/New|What/i);
  expect(tPromises).toMatch(/Promise/i);

  // Vérifie que la langue courante est bien EN (si exposée)
  const cur = await page.evaluate(() => window.currentLanguage || (window.BC_LANG && window.BC_LANG.current) || null);
  expect(cur === null || cur === "EN").toBeTruthy();

  // Aucune erreur JS silencieuse
  expect(errors, "JS errors detected:\n" + errors.join("\n")).toEqual([]);
});
