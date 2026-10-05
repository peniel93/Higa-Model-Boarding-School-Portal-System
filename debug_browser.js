const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Simulate logging in as MainRegistrar
  console.log('Simulating login as MainRegistrar');
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
    // Wait for the dashboard to render
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if there is a side-settings link and click it
    await page.evaluate(() => {
      const settingsLink = document.getElementById('side-settings');
      if (settingsLink) {
        console.log('Clicking side-settings');
        settingsLink.click();
      } else {
        console.log('side-settings not found');
      }
    });

    await new Promise(r => setTimeout(r, 2000));
    console.log('Finished waiting. Checking if any errors occurred.');
  } catch (err) {
    console.error('Error in script:', err.message);
  }

  await browser.close();
})();
