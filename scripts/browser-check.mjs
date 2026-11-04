import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
await mkdir(".qa", { recursive: true });
const browser = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=9333",
    `--user-data-dir=${path.resolve(".qa/chrome")}`,
    "about:blank",
  ],
  { windowsHide: true, stdio: "ignore" },
);
let socket;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  let tabs;
  for (let i = 0; i < 40; i++) {
    try {
      tabs = await fetch("http://127.0.0.1:9333/json").then((r) => r.json());
      break;
    } catch {
      await pause(250);
    }
  }
  if (!tabs) throw new Error("Chrome debugging is unavailable");
  socket = new WebSocket(
    tabs.find((t) => t.type === "page").webSocketDebuggerUrl,
  );
  await new Promise((resolve) =>
    socket.addEventListener("open", resolve, { once: true }),
  );
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.id) {
      const p = pending.get(data.id);
      pending.delete(data.id);
      data.error
        ? p.reject(new Error(data.error.message))
        : p.resolve(data.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const current = ++id;
      pending.set(current, { resolve, reject });
      socket.send(JSON.stringify({ id: current, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:5173/" });
  await pause(1000);
  await evaluate(`localStorage.clear()`);
  await send("Page.reload");
  await pause(23000);
  console.log(
    "LIVE PAGE",
    JSON.stringify(
      await evaluate(
        `({title:document.title,products:document.querySelectorAll('.product-card').length,error:document.querySelector('[role=alert]')?.textContent,images:[...document.images].map(i=>({src:i.src,loaded:i.complete&&i.naturalWidth>0})),overflow:document.documentElement.scrollWidth>innerWidth})`,
      ),
    ),
  );
  for (const width of [320, 768, 1024]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 640,
    });
    await pause(200);
    const layout = await evaluate(
      `({overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns.split(' ').length})`,
    );
    if (
      layout.overflow ||
      layout.columns !== (width < 640 ? 1 : width < 1024 ? 2 : 4)
    )
      throw new Error(
        `Responsive layout failed at ${width}px: ${JSON.stringify(layout)}`,
      );
    console.log("PASS: responsive columns and no overflow at", width);
  }
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false,
  });
  let shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(".qa/home-desktop.png", Buffer.from(shot.data, "base64"));
  await send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 900,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await pause(1000);
  console.log(
    "MOBILE",
    await evaluate(
      `JSON.stringify({overflow:document.documentElement.scrollWidth>innerWidth,width:innerWidth,content:document.documentElement.scrollWidth})`,
    ),
  );
  shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(".qa/home-mobile.png", Buffer.from(shot.data, "base64"));
  const check = async (expression, label) => {
    if (!(await evaluate(expression))) throw new Error(`FAIL: ${label}`);
    console.log(`PASS: ${label}`);
  };
  const click = async (selector) => {
    await evaluate(
      `document.querySelector(${JSON.stringify(selector)})?.click()`,
    );
    await pause(350);
  };
  const fill = async (selector, value) => {
    await evaluate(
      `(()=>{const el=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`,
    );
    await pause(150);
  };
  await fill(".search-field input", "FJALLRAVEN");
  await check(
    `document.querySelectorAll('.product-card').length===1`,
    "case insensitive product search",
  );
  await click(".active-filters button");
  await check(
    `document.querySelectorAll('.product-card').length===20`,
    "reset restores API catalog",
  );
  await click(".add-button");
  await click(".add-button");
  await check(
    `document.querySelector('.cart-badge').textContent==='2'`,
    "add to cart updates badge immediately",
  );
  await click(".cart-link");
  await check(
    `document.querySelectorAll('.cart-item').length===1`,
    "same product merges into one cart line",
  );
  await click(".quantity-control button:last-child");
  await check(
    `document.querySelector('.cart-badge').textContent==='3'`,
    "cart quantity selector updates badge",
  );
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false,
  });
  shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(".qa/cart.png", Buffer.from(shot.data, "base64"));
  await click(".cart-item-info>a");
  await check(
    `document.querySelector('.detail-info h1')!==null`,
    "product detail navigation",
  );
  await click(".quantity-control button:last-child");
  shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(".qa/detail.png", Buffer.from(shot.data, "base64"));
  await click(".detail-actions button:last-child");
  await check(
    `location.pathname==='/login'`,
    "Buy Now passes through protected login",
  );
  await check(
    `document.querySelector('.cart-badge').textContent==='5'`,
    "Buy Now adds selected quantity",
  );
  await fill("#username", "Demo Shopper");
  await fill("#password", "wrong");
  await click(".sign-in-button");
  await check(
    `document.querySelector('[role=alert]')!==null`,
    "wrong password is rejected",
  );
  await fill("#password", "123456");
  await click(".sign-in-button");
  await check(
    `location.pathname==='/checkout'`,
    "successful login returns to checkout",
  );
  await click(".order-summary button[type=submit]");
  await check(
    `document.querySelectorAll('.form-error').length>=4`,
    "shipping validation rejects incomplete form",
  );
  await fill("#fullName", "Alex Morgan");
  await fill("#email", "alex@example.com");
  await fill("#phone", "+1 555 123 4567");
  await fill("#address", "123 Green Street");
  await fill("#city", "Austin");
  shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(".qa/checkout.png", Buffer.from(shot.data, "base64"));
  await send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 900,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await check(
    `document.documentElement.scrollWidth<=innerWidth`,
    "checkout has no mobile overflow",
  );
  await evaluate(
    `(()=>{const b=document.querySelector('.order-summary button[type=submit]');b.click();b.click();})()`,
  );
  await pause(400);
  await check(
    `document.querySelector('.order-success')!==null && document.querySelector('.cart-badge').textContent==='0'`,
    "one successful order clears cart",
  );
  await click('button[aria-label="Switch to dark mode"]');
  await check(
    `document.documentElement.classList.contains('dark') && localStorage.getItem('shopmini-theme')==='dark'`,
    "theme updates and persists",
  );
  shot = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(
    ".qa/success-dark-mobile.png",
    Buffer.from(shot.data, "base64"),
  );
  await click('button[aria-label="Log out"]');
  await check(
    `location.pathname==='/login'`,
    "logout immediately protects checkout",
  );
  await send("Page.navigate", { url: "http://127.0.0.1:5173/checkout" });
  await pause(1500);
  console.log(
    "PROTECTED",
    await evaluate(
      `JSON.stringify({path:location.pathname,heading:document.querySelector('h1')?.textContent})`,
    ),
  );
  await send("Page.navigate", { url: "http://127.0.0.1:5173/missing" });
  await pause(600);
  console.log(
    "404",
    await evaluate(`document.querySelector('h1')?.textContent`),
  );
  await send("Browser.close");
} finally {
  socket?.close();
  browser.kill();
}
