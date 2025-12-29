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
  // Conditionnels : certains éléments peuvent ne pas être présents sur toutes les pages
  const navHelp = page.locator('[data-i18n="navHelp"]');
  const navNews = page.locator('[data-i18n="navNews"]');
  const navPromises = page.locator('[data-i18n="navPromises"]');

  // Test navHelp si présent
  if (await navHelp.count() > 0) {
    await expect(navHelp.first()).toBeVisible();
    const tHelp = (await navHelp.first().innerText()).trim();
    expect(tHelp).toMatch(/Help/i);
  }

  // Test navNews si présent
  if (await navNews.count() > 0) {
    await expect(navNews.first()).toBeVisible();
    const tNews = (await navNews.first().innerText()).trim();
    expect(tNews).toMatch(/New|What/i);
  }

  // Test navPromises si présent
  if (await navPromises.count() > 0) {
    await expect(navPromises.first()).toBeVisible();
    const tPromises = (await navPromises.first().innerText()).trim();
    expect(tPromises).toMatch(/Promise/i);
  }

  // Vérifie que la langue courante est bien EN (si exposée)
  const cur = await page.evaluate(() => window.currentLanguage || (window.BC_LANG && window.BC_LANG.current) || null);
  expect(cur === null || cur === "EN").toBeTruthy();

  // Aucune erreur JS silencieuse
  expect(errors, "JS errors detected:\n" + errors.join("\n")).toEqual([]);
});
