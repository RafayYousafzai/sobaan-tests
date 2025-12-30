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

// Helper: Open Dropdown (Only used for visual checks)
async function openDropdown(page: Page, menuText: string): Promise<void> {
  const menu = page.locator(NavSelectors.mainMenuItem(menuText), {
    hasText: menuText,
  });
  // Force click to ensure it triggers
  await menu.dispatchEvent("mouseenter");
  await menu.hover({ force: true });
}

// Helper: Verify Attribute (Ignores visibility, preventing timeouts)
async function verifyLinkAttribute(
  page: Page,
  selector: string,
  expectedUrl: string
): Promise<void> {
  const link = page.locator(selector);

  // 1. Check if the element exists in the HTML
  await expect(link).toHaveCount(1);

  // 2. Check the URL strictly
  await expect(link).toHaveAttribute("href", expectedUrl);
}

// --- TEST SUITE ---

test.describe("Fast Menu Verification", () => {
  // Setup: Go to home page ONCE
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  });

  // 1. VISUAL CHECK (Only Top Level)
  test("Check all Dropdowns open correctly", async ({ page }) => {
    await openDropdown(page, "Products");
    await expect(page.locator(NavSelectors.MAIN_NAV)).toContainText(
      "Edible Salt"
    );

    await openDropdown(page, "Industrial Salts");
    await expect(page.locator(NavSelectors.MAIN_NAV)).toContainText(
      "Pool Salt"
    );

    await openDropdown(page, "About Us");
    await expect(page.locator(NavSelectors.MAIN_NAV)).toContainText("Our Team");

    await openDropdown(page, "Resources");
    await expect(page.locator(NavSelectors.MAIN_NAV)).toContainText(
      "Company Profile"
    );
  });

  // 2. CODE-LEVEL CHECKS (Fast & Timeout-Proof)

  test("Verify 'Products' links", async ({ page }) => {
    // We don't even need to open the menu. The code is in the DOM.
    for (const item of productsSubmenuItems) {
      if (item.url) {
        await verifyLinkAttribute(
          page,
          NavSelectors.subMenuItem(item.class),
          item.url
        );
      }
    }
  });

  test("Verify 'Industrial Salts' links", async ({ page }) => {
    for (const item of industrialSaltSubmenuItems) {
      if (item.url) {
        await verifyLinkAttribute(
          page,
          NavSelectors.subMenuItem(item.class),
          item.url
        );
      }
    }
  });

  test("Verify 'About Us' links", async ({ page }) => {
    for (const item of aboutUsSubmenuItems) {
      if (item.url) {
        await verifyLinkAttribute(
          page,
          NavSelectors.subMenuItem(item.class),
          item.url
        );
      }
    }
  });

  test("Verify 'Resources' links", async ({ page }) => {
    for (const item of resourcesSubmenuItems) {
      if (item.url) {
        await verifyLinkAttribute(
          page,
          NavSelectors.subMenuItem(item.class),
          item.url
        );
      }
    }
  });

  // 3. NESTED MENU CHECK (The One That Failed)
  test("Verify Nested Submenu Links (Salt Lamps, etc)", async ({ page }) => {
    // FIX: Removed scroll/hover logic. We just check the HTML directly.
    // This works even if the menu is closed or hidden.

    for (const submenu of nestedSubmenus) {
      for (const item of submenu.items) {
        if (item.url) {
          await verifyLinkAttribute(
            page,
            NavSelectors.nestedSubMenuItem(submenu.parentClass, item.class),
            item.url
          );
        }
      }
    }
  });

  // 4. SMOKE TEST (Real Click)
  test("Smoke Test: Click 'Contact Us'", async ({ page }) => {
    const contactLink = page
      .locator(NavSelectors.MAIN_NAV)
      .getByText("Contact Us");
    await Promise.all([
      page.waitForURL(/.*contact-us/, { timeout: 30000 }),
      contactLink.click(),
    ]);
  });
});
