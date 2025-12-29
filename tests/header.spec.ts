import { test, expect, Page, Locator } from "@playwright/test";

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
  label: string
): Promise<Locator> {
  const item = page.locator(selector, { hasText: label });
  await expect(item).toBeVisible();
  return item;
}

async function verifyMenuItems(
  page: Page,
  items: MenuItem[],
  selectorFn: (itemClass: string) => string
): Promise<void> {
  for (const item of items) {
    await verifyMenuItem(page, selectorFn(item.class), item.label);
  }
}

// Type definitions
interface MenuItem {
  class: string;
  label: string;
  hasSubmenu?: boolean;
}

interface SubmenuGroup {
  parentClass: string;
  parentLabel: string;
  items: MenuItem[];
}

// Test data
const productsSubmenuItems: MenuItem[] = [
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

const industrialSaltSubmenuItems: MenuItem[] = [
  { class: "menu-item-6095", label: "Pool Salt" },
  { class: "menu-item-6094", label: "Road Salt" },
  { class: "menu-item-6096", label: "Ice Salt" },
];

const nestedSubmenus: SubmenuGroup[] = [
  {
    parentClass: "menu-item-6089",
    parentLabel: "Salt Lamp",
    items: [
      { class: "menu-item-6099", label: "USB Salt Lamp" },
      { class: "menu-item-6100", label: "3D Salt Lamp" },
      { class: "menu-item-6101", label: "Night Salt Lamp" },
      { class: "menu-item-6102", label: "Animal Shape Lamp" },
      { class: "menu-item-6103", label: "Natural Salt Lamp" },
      { class: "menu-item-6104", label: "Geometrical Shape Lamp" },
      { class: "menu-item-6105", label: "Aroma Therapy Salt Lamp" },
    ],
  },
  {
    parentClass: "menu-item-6206",
    parentLabel: "Candle Holders",
    items: [
      { class: "menu-item-6207", label: "White Candle Holder" },
      { class: "menu-item-6208", label: "Grey Candle Holder" },
      { class: "menu-item-6209", label: "Pink Candle Holder" },
      { class: "menu-item-6210", label: "Geometric Candle Holder" },
    ],
  },
];

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

  test("Check all Products submenu items", async ({ page }) => {
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

  test("Check all Industrial Salts submenu items", async ({ page }) => {
    await openDropdown(page, "Industrial Salts");

    await verifyMenuItems(
      page,
      industrialSaltSubmenuItems,
      NavSelectors.subMenuItem
    );
  });
});
