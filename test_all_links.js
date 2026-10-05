const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR CONSOLE:', text);
    } else {
      console.log('BROWSER CONSOLE:', text);
    }
  });
  page.on('pageerror', error => console.error('BROWSER PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Simulate logging in as MainRegistrar
  try {
    await page.evaluate(() => {
      const registrarUser = {
        id: "mock_registrar",
        username: "registrar",
        password: "password",
        role: "MainRegistrar",
        name: "Main Registrar User",
        isActive: true,
        rights: ["settings", "users", "courses", "announcements"]
      };
      localStorage.setItem("higa_current_user", JSON.stringify(registrarUser));
      window.auth.checkSession();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Get all sidebar links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#sidebar-nav-list a')).map(a => a.id);
    });

    console.log('Found links:', links);

    for (const linkId of links) {
      console.log('Clicking link:', linkId);
      await page.evaluate((id) => {
        document.getElementById(id).click();
      }, linkId);
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('Finished testing all links.');
  } catch (err) {
    console.error('Node script error:', err.message);
  }

  await browser.close();
})();
