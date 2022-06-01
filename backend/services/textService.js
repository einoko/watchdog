import puppeteer from "puppeteer";
import { PuppeteerBlocker } from "@cliqz/adblocker-puppeteer";
import fetch from "cross-fetch";
import { promises as fs } from "fs";
import prependHttp from "prepend-http";

const scrollToBottom = async () => {
  await new Promise((resolve) => {
    const maxDistance = 10000; // in case there is infinite scroll, should be enough for most sites
    const distance = 100;
    const delay = 100;
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

export const getWebsiteText = async (url, selector = null) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const text = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch, {
    path: "engine.bin",
    read: fs.readFile,
    write: fs.writeFile,
  }).then(async (blocker) => {
    await blocker.enableBlockingInPage(page);

    try {
      await page.goto(prependHttp(url));
    } catch (err) {
      await browser.close();
      return null;
    }

    await page.evaluate(scrollToBottom);

    await wait(1000);

    const text = await page.evaluate(async (selector) => {
      if (selector) {
        const element = document.querySelector(selector);
        if (element) {
          return element.innerText;
        }
      }
      return document.body.innerText;
    }, selector);

    return text ? text : null;
  });

  await browser.close();

  return text;
};
