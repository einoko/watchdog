import puppeteer from "puppeteer";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import fetch from "cross-fetch";
import { promises as fs } from "fs";

const scrollToBottom = async () => {
  await new Promise((resolve) => {
    const maxDistance = 10000; // in case there is infinite scroll, should be enough for most sites
    const distance = 100;
    const delay = 60;
    const timer = setInterval(() => {
      document.scrollingElement.scrollBy(0, distance);
      console.log(document.scrollingElement.scrollTop);
      if (
        document.scrollingElement.scrollTop + window.innerHeight >=
          document.scrollingElement.scrollHeight ||
        document.scrollingElement.scrollTop + window.innerHeight > maxDistance
      ) {
        clearInterval(timer);
        resolve();
      }
    }, delay);
  });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getWebsiteText = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const text = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch, {
    path: "engine.bin",
    read: fs.readFile,
    write: fs.writeFile,
  }).then(async (blocker) => {
    blocker.enableBlockingInPage(page);

    try {
      await page.goto(url);
    } catch (err) {
      await browser.close();
      return null;
    }

    await page.evaluate(scrollToBottom);

    await wait(1000);

    const text = await page.evaluate(async () => {
      const text = document.body.innerText;
      return text;
    });

    return text ? text : null;
  });

  await browser.close();

  return text;
};
