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
export const productsSubmenuItems: MenuItem[] = [
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

export const industrialSaltSubmenuItems: MenuItem[] = [
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

export const aboutUsSubmenuItems: MenuItem[] = [
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

export const resourcesSubmenuItems: MenuItem[] = [
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

export const nestedSubmenus: SubmenuGroup[] = [
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
