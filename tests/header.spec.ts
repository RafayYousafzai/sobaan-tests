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
  await item.click();

  // Wait for navigation and verify URL
  await page.waitForURL(expectedUrl);
  expect(page.url()).toBe(expectedUrl);

  // Navigate back to home
  await page.goto(BASE_URL);
}

// Type definitions
interface MenuItem {
  class: string;
  label: string;
  url?: string;
  hasSubmenu?: boolean;
}

interface SubmenuGroup {
  parentClass: string;
  parentLabel: string;
  items: MenuItem[];
}

// Test data
const productsSubmenuItems: MenuItem[] = [
  {
    class: "menu-item-6088",
    label: "Edible Salt",
    url: "https://sobaansalts.com/himalayan-edible-salt-manufacturer/",
  },
  {
    class: "menu-item-6089",
    label: "Salt Lamp",
    hasSubmenu: true,
    url: "https://sobaansalts.com/himalayan-salt-lamp-supplier-and-manufacturer/",
  },
  {
    class: "menu-item-6206",
    label: "Candle Holders",
    hasSubmenu: true,
    url: "https://sobaansalts.com",
  },
  {
    class: "menu-item-7327",
    label: "Bath Salt",
    url: "https://sobaansalts.com/bath-salts-manufacturer/",
  },
  {
    class: "menu-item-9808",
    label: "Salt Tiles",
    url: "https://sobaansalts.com/salt-tiles/",
  },
  {
    class: "menu-item-6098",
    label: "Salt Licks",
    url: "https://sobaansalts.com/himalayan-salt-lick-manufacturer/",
  },
  {
    class: "menu-item-6091",
    label: "Iodized Salt",
    url: "https://sobaansalts.com/iodized-salt-manufacturer/",
  },
  {
    class: "menu-item-6092",
    label: "Epsom Salt",
    url: "https://sobaansalts.com/epsom-salt-manufacturer/",
  },
  {
    class: "menu-item-6093",
    label: "Black Salt",
    url: "https://sobaansalts.com/black-salt-manufacturer/",
  },
  {
    class: "menu-item-6135",
    label: "Table Salt",
    url: "https://sobaansalts.com/table-salt-manufacturers/",
  },
  {
    class: "menu-item-6097",
    label: "Water Softner Salt",
    url: "https://sobaansalts.com/water-softener-salt-manufacturer/",
  },
];

const industrialSaltSubmenuItems: MenuItem[] = [
  {
    class: "menu-item-6095",
    label: "Pool Salt",
    url: "https://sobaansalts.com/pool-salt-manufacturers/",
  },
  {
    class: "menu-item-6094",
    label: "Road Salt",
    url: "https://sobaansalts.com/road-salt-manufacturers/",
  },
  {
    class: "menu-item-6096",
    label: "Ice Salt",
    url: "https://sobaansalts.com/ice-melt-salt-manufacturer/",
  },
];

const aboutUsSubmenuItems: MenuItem[] = [
  {
    class: "menu-item-7459",
    label: "Our Team",
    url: "https://sobaansalts.com/our-team/",
  },
  {
    class: "menu-item-8125",
    label: "Careers",
    url: "https://sobaansalts.com/careers/",
  },
];

const resourcesSubmenuItems: MenuItem[] = [
  {
    class: "menu-item-6132",
    label: "Company Profile",
    url: "https://sobaansalts.com/company-profile/",
  },
  {
    class: "menu-item-6131",
    label: "Certificates",
    url: "https://sobaansalts.com/certificates/",
  },
  {
    class: "menu-item-6129",
    label: "Blogs",
    url: "https://sobaansalts.com/blog/",
  },
  {
    class: "menu-item-10676",
    label: "Private Labeling",
    url: "https://sobaansalts.com/private-labeling/",
  },
];

const nestedSubmenus: SubmenuGroup[] = [
  {
    parentClass: "menu-item-6089",
    parentLabel: "Salt Lamp",
    items: [
      {
        class: "menu-item-6099",
        label: "USB Salt Lamp",
        url: "https://sobaansalts.com/himalayan-usb-salt-lamp-manufacturer/",
      },
      {
        class: "menu-item-6100",
        label: "3D Salt Lamp",
        url: "https://sobaansalts.com/himalayan-3d-salt-lamp-manufacturer/",
      },
      {
        class: "menu-item-6101",
        label: "Night Salt Lamp",
        url: "https://sobaansalts.com/himalayan-salt-night-lamp-manufacturer/",
      },
      {
        class: "menu-item-6102",
        label: "Animal Shape Lamp",
        url: "https://sobaansalts.com/himalayan-animal-salt-lamps-manufacturer/",
      },
      {
        class: "menu-item-6103",
        label: "Natural Salt Lamp",
        url: "https://sobaansalts.com/natural-himalayan-salt-lamp-manufacturer/",
      },
      {
        class: "menu-item-6104",
        label: "Geometrical Shape Lamp",
        url: "https://sobaansalts.com/geometrical-himalayan-salt-lamp-manufacturer/",
      },
      {
        class: "menu-item-6105",
        label: "Aroma Therapy Salt Lamp",
        url: "https://sobaansalts.com/himalayan-aromatherapy-salt-lamp-manufacturer/",
      },
    ],
  },
  {
    parentClass: "menu-item-6206",
    parentLabel: "Candle Holders",
    items: [
      {
        class: "menu-item-6207",
        label: "White Candle Holder",
        url: "https://sobaansalts.com/himalayan-white-salt-candle-holder-manufacturer/",
      },
      {
        class: "menu-item-6208",
        label: "Grey Candle Holder",
        url: "https://sobaansalts.com/himalayan-grey-salt-candle-holder-manufacturer/",
      },
      {
        class: "menu-item-6209",
        label: "Pink Candle Holder",
        url: "https://sobaansalts.com/himalayan-pink-natural-candle-holder-manufacturer/",
      },
      {
        class: "menu-item-6210",
        label: "Geometric Candle Holder",
        url: "https://sobaansalts.com/himalayan-pink-geometric-candle-holder-manufacturer/",
      },
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
