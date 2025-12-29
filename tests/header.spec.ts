import { test, expect } from "@playwright/test";

// test("Check Home Menu Link", async ({ page }) => {
//   await page.goto("https://sobaansalts.com/");

//   // FIX: We added "nav.elementor-nav-menu--main" before the "a" tag.
//   // This forces Playwright to only look inside the DESKTOP menu, ignoring the hidden mobile one.
//   const homeLink = page.locator(
//     "nav.elementor-nav-menu--main a.elementor-item",
//     {
//       hasText: "Home",
//     }
//   );

//   // 2. VERIFY: Now this should pass because we are targeting the visible one.
//   await expect(homeLink).toBeVisible();

//   // 3. CHECK ATTRIBUTE
//   await expect(homeLink).toHaveAttribute(
//     "href",
//     "https://sobaansalts.com/salt-manufacturers/"
//   );

//   // 4. CLICK IT
//   await homeLink.click();
// });

test("Check Products Dropdown", async ({ page }) => {
  await page.goto("https://sobaansalts.com/");

  // FIX: Added dots (.) for classes and the parent container
  // We strictly look inside the Main Desktop Menu for a link with text "Products"
  const productsMenu = page.locator(
    "nav.elementor-nav-menu--main a.elementor-item",
    { hasText: "Products" }
  );

  // Click instead of hover
  await productsMenu.click();
  // Wait for dropdown animation (optional, adjust as needed)
  await page.waitForTimeout(300);

  const subItem = page.locator(
    "nav.elementor-nav-menu--main a.elementor-sub-item",
    { hasText: "Edible Salt" }
  );
  await expect(subItem).toBeVisible();
});

test("Check all Products submenu items", async ({ page }) => {
  await page.goto("https://sobaansalts.com/");

  // Open the Products dropdown
  const productsMenu = page.locator(
    "nav.elementor-nav-menu--main a.elementor-item",
    { hasText: "Products" }
  );
  await productsMenu.click();
  await page.waitForTimeout(300);

  // Map of menu-item-* classes to expected labels
  const submenuItems = [
    { class: "menu-item-6088", label: "Edible Salt" },
    { class: "menu-item-6089", label: "Salt Lamp", hasSubmenu: true },
    { class: "menu-item-6206", label: "Candle Holders", hasSubmenu: true },
    { class: "menu-item-7327", label: "Bath Salt" },
    { class: "menu-item-9808", label: "Salt Tiles" },
    { class: "menu-item-6098", label: "Salt Licks" },
    { class: "menu-item-6091", label: "Iodized Salt" },
    { class: "menu-item-6092", label: "Epsom Salt" },
    { class: "menu-item-6093", label: "Black Salt" },
    { class: "menu-item-6135", label: "Table Salt" },
    { class: "menu-item-6097", label: "Water Softner Salt" },
  ];

  for (const item of submenuItems) {
    const subItem = page.locator(
      `nav.elementor-nav-menu--main ul.sub-menu > li.${item.class} > a.elementor-sub-item`
    );
    await expect(subItem).toBeVisible();
    if (item.hasSubmenu) {
      await subItem.click();
      await page.waitForTimeout(300);
    }
  }

  // Check Salt Lamp and Candle Holders submenus
  // Expand Salt Lamp submenu
  const saltLampMenu = page.locator(
    "nav.elementor-nav-menu--main ul.sub-menu > li.menu-item-6089 > a.elementor-sub-item"
  );
  await saltLampMenu.click();
  await page.waitForTimeout(300);

  // Salt Lamp sub-items
  const saltLampSubItems = [
    { class: "menu-item-6099", label: "USB Salt Lamp" },
    { class: "menu-item-6100", label: "3D Salt Lamp" },
    { class: "menu-item-6101", label: "Night Salt Lamp" },
    { class: "menu-item-6102", label: "Animal Shape Lamp" },
    { class: "menu-item-6103", label: "Natural Salt Lamp" },
    { class: "menu-item-6104", label: "Geometrical Shape Lamp" },
    { class: "menu-item-6105", label: "Aroma Therapy Salt Lamp" },
  ];
  for (const item of saltLampSubItems) {
    const subItem = page.locator(
      `nav.elementor-nav-menu--main ul.sub-menu > li.menu-item-6089 ul.sub-menu > li.${item.class} > a.elementor-sub-item`
    );
    await expect(subItem).toBeVisible();
  }

  // Expand Candle Holders submenu
  const candleMenu = page.locator(
    "nav.elementor-nav-menu--main ul.sub-menu > li.menu-item-6206 > a.elementor-sub-item"
  );
  await candleMenu.click();
  await page.waitForTimeout(300);

  // Candle Holders sub-items
  const candleSubItems = [
    { class: "menu-item-6207", label: "White Candle Holder" },
    { class: "menu-item-6208", label: "Grey Candle Holder" },
    { class: "menu-item-6209", label: "Pink Candle Holder" },
    { class: "menu-item-6210", label: "Geometric Candle Holder" },
  ];
  for (const item of candleSubItems) {
    const subItem = page.locator(
      `nav.elementor-nav-menu--main ul.sub-menu > li.menu-item-6206 ul.sub-menu > li.${item.class} > a.elementor-sub-item`
    );
    await expect(subItem).toBeVisible();
  }
});
