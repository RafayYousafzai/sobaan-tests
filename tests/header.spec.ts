import { test, expect, Page, Locator } from "@playwright/test";
import {
  aboutUsSubmenuItems,
  industrialSaltSubmenuItems,
  nestedSubmenus,
  productsSubmenuItems,
  resourcesSubmenuItems,
} from "../constant/menus-data";

// Constants
const BASE_URL = "https://sobaansalts.com/";
const DROPDOWN_ANIMATION_DELAY = 300;

// Helper class for navigation selectors
class NavSelectors {
  static readonly MAIN_NAV = "nav.elementor-nav-menu--main";
  static readonly MENU_ITEM = "a.elementor-item";
  static readonly SUB_ITEM = "a.elementor-sub-item";
  static readonly SUB_MENU = "ul.sub-menu";

  static mainMenuItem(text: string): string {
    return `${NavSelectors.MAIN_NAV} ${NavSelectors.MENU_ITEM}`;
  }

  static subMenuItem(parentClass: string): string {
    return `${NavSelectors.MAIN_NAV} ${NavSelectors.SUB_MENU} > li.${parentClass} > ${NavSelectors.SUB_ITEM}`;
  }

  static nestedSubMenuItem(parentClass: string, itemClass: string): string {
    return `${NavSelectors.MAIN_NAV} ${NavSelectors.SUB_MENU} > li.${parentClass} ${NavSelectors.SUB_MENU} > li.${itemClass} > ${NavSelectors.SUB_ITEM}`;
  }
}

// Helper functions
async function openDropdown(page: Page, menuText: string): Promise<void> {
  const menu = page.locator(NavSelectors.mainMenuItem(menuText), {
    hasText: menuText,
  });
  await menu.click();
  await page.waitForTimeout(DROPDOWN_ANIMATION_DELAY);
}

async function verifyMenuItem(
  page: Page,
  selector: string,
  label: string,
  expectedUrl?: string
): Promise<Locator> {
  const item = page.locator(selector, { hasText: label });
  await expect(item).toBeVisible();

  // Verify URL if provided
  if (expectedUrl) {
    await expect(item).toHaveAttribute("href", expectedUrl);
  }

  return item;
}

async function verifyMenuItems(
  page: Page,
  items: MenuItem[],
  selectorFn: (itemClass: string) => string
): Promise<void> {
  for (const item of items) {
    await verifyMenuItem(page, selectorFn(item.class), item.label, item.url);
  }
}

async function verifyLinkNavigation(
  page: Page,
  selector: string,
  label: string,
  expectedUrl: string
): Promise<void> {
  const item = page.locator(selector, { hasText: label });

  // 1. Click and wait for the network to be idle
  await Promise.all([page.waitForLoadState("networkidle"), item.click()]);

  // 2. Use a Regex to check the URL (ignores trailing slashes or minor query params)
  const urlPattern = new RegExp(expectedUrl.replace(/\/$/, "") + "/?$");
  await expect(page).toHaveURL(urlPattern, { timeout: 10000 });

  // 3. Clean transition back
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
}

// Type definitions
interface MenuItem {
  class: string;
  label: string;
  url?: string;
  hasSubmenu?: boolean;
}

// Tests
test.describe("Navigation Menu Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("Check Products Dropdown opens", async ({ page }) => {
    await openDropdown(page, "Products");

    const edibleSaltItem = page.locator(
      NavSelectors.subMenuItem("menu-item-6088"),
      { hasText: "Edible Salt" }
    );
    await expect(edibleSaltItem).toBeVisible();
  });

  test("Check all Products submenu items and URLs", async ({ page }) => {
    await openDropdown(page, "Products");

    await verifyMenuItems(page, productsSubmenuItems, NavSelectors.subMenuItem);
  });

  test("Check nested submenus (Salt Lamp & Candle Holders)", async ({
    page,
  }) => {
    await openDropdown(page, "Products");

    for (const submenu of nestedSubmenus) {
      const parentItem = await verifyMenuItem(
        page,
        NavSelectors.subMenuItem(submenu.parentClass),
        submenu.parentLabel
      );

      await parentItem.click();
      await page.waitForTimeout(DROPDOWN_ANIMATION_DELAY);

      await verifyMenuItems(page, submenu.items, (itemClass) =>
        NavSelectors.nestedSubMenuItem(submenu.parentClass, itemClass)
      );
    }
  });

  test("Check Industrial Salts dropdown opens", async ({ page }) => {
    await openDropdown(page, "Industrial Salts");

    const poolSaltItem = page.locator(
      NavSelectors.subMenuItem("menu-item-6095"),
      { hasText: "Pool Salt" }
    );
    await expect(poolSaltItem).toBeVisible();
  });

  test("Check all Industrial Salts submenu items and URLs", async ({
    page,
  }) => {
    await openDropdown(page, "Industrial Salts");

    await verifyMenuItems(
      page,
      industrialSaltSubmenuItems,
      NavSelectors.subMenuItem
    );
  });

  test("Check About Us dropdown opens", async ({ page }) => {
    await openDropdown(page, "About Us");

    const ourTeamItem = page.locator(
      NavSelectors.subMenuItem("menu-item-7459"),
      { hasText: "Our Team" }
    );
    await expect(ourTeamItem).toBeVisible();
  });

  test("Check all About Us submenu items and URLs", async ({ page }) => {
    await openDropdown(page, "About Us");

    await verifyMenuItems(page, aboutUsSubmenuItems, NavSelectors.subMenuItem);
  });

  test("Check Resources dropdown opens", async ({ page }) => {
    await openDropdown(page, "Resources");

    const companyProfileItem = page.locator(
      NavSelectors.subMenuItem("menu-item-6132"),
      { hasText: "Company Profile" }
    );
    await expect(companyProfileItem).toBeVisible();
  });

  test("Check all Resources submenu items and URLs", async ({ page }) => {
    await openDropdown(page, "Resources");

    await verifyMenuItems(
      page,
      resourcesSubmenuItems,
      NavSelectors.subMenuItem
    );
  });
});

// Navigation Tests - Actually click and verify page loads
test.describe("Link Navigation Tests", () => {
  test.slow();

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("Verify Products submenu links navigate correctly", async ({ page }) => {
    await openDropdown(page, "Products");

    // Test only items without submenus
    const itemsToTest = productsSubmenuItems.filter(
      (item) => !item.hasSubmenu && item.url
    );

    for (const item of itemsToTest) {
      await page.goto(BASE_URL);
      await openDropdown(page, "Products");
      await verifyLinkNavigation(
        page,
        NavSelectors.subMenuItem(item.class),
        item.label,
        item.url!
      );
    }
  });

  test("Verify Industrial Salts submenu links navigate correctly", async ({
    page,
  }) => {
    for (const item of industrialSaltSubmenuItems) {
      await openDropdown(page, "Industrial Salts");
      await verifyLinkNavigation(
        page,
        NavSelectors.subMenuItem(item.class),
        item.label,
        item.url!
      );
    }
  });

  test("Verify About Us submenu links navigate correctly", async ({ page }) => {
    for (const item of aboutUsSubmenuItems) {
      await openDropdown(page, "About Us");
      await verifyLinkNavigation(
        page,
        NavSelectors.subMenuItem(item.class),
        item.label,
        item.url!
      );
    }
  });

  test("Verify Resources submenu links navigate correctly", async ({
    page,
  }) => {
    for (const item of resourcesSubmenuItems) {
      await openDropdown(page, "Resources");
      await verifyLinkNavigation(
        page,
        NavSelectors.subMenuItem(item.class),
        item.label,
        item.url!
      );
    }
  });

  test("Verify nested submenu links navigate correctly", async ({ page }) => {
    await openDropdown(page, "Products");

    for (const submenu of nestedSubmenus) {
      for (const item of submenu.items) {
        await page.goto(BASE_URL);
        await openDropdown(page, "Products");

        const parentItem = page.locator(
          NavSelectors.subMenuItem(submenu.parentClass),
          { hasText: submenu.parentLabel }
        );
        await parentItem.click();
        await page.waitForTimeout(DROPDOWN_ANIMATION_DELAY);

        await verifyLinkNavigation(
          page,
          NavSelectors.nestedSubMenuItem(submenu.parentClass, item.class),
          item.label,
          item.url!
        );
      }
    }
  });
});
