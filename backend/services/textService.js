import puppeteer from "puppeteer";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import fetch from "cross-fetch";

export const getWebsiteText = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });

  try {
    await page.goto(url);
  } catch (err) {
    await browser.close();
    return null;
  }

  const text = await page.evaluate(() => document.body.innerText);
  await browser.close();
  return text;
};
