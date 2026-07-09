window.DarkestData = {
  regionContent: {
    ruins: {
      name: 'Ruins',
      type: 'basic',
      image: 'img/regions/ruins.png',
      provision: 'Pack torches, bandages, and anti-venom. A strong ranged party and stun are useful here.',
      tips: 'Avoid grouping heroes too tightly, stay aware of trap tiles, and bring bleed resist where possible.',
      provisionGrid: {
        short: {
          totalPrice: 2850,
          items: [
            { image: 'img/provision/Food.png', count: 12 },
            { image: 'img/provision/Shovel.png', count: 2 },
            { image: 'img/provision/Bandage.png', count: 1 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 1 },
            { image: 'img/provision/Skeleton_Key.png', count: 1 },
            { image: 'img/provision/Holy_Water.png', count: 2 },
            { image: 'img/provision/Torch.png', count: 8 }
          ]
        },
        mid: {
          totalPrice: 4625,
          items: [
            { image: 'img/provision/Firewood.png', count: 1 },
            { image: 'img/provision/Food.png', count: 18 },
            { image: 'img/provision/Shovel.png', count: 3 },
            { image: 'img/provision/Bandage.png', count: 2 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 2 },
            { image: 'img/provision/Skeleton_Key.png', count: 2 },
            { image: 'img/provision/Holy_Water.png', count: 3 },
            { image: 'img/provision/Torch.png', count: 13 },
          ]
        },
        long: {
          totalPrice: 5950,
          items: [
            { image: 'img/provision/Firewood.png', count: 2 },
            { image: 'img/provision/Food.png', count: 20 },
            { image: 'img/provision/Shovel.png', count: 4 },
            { image: 'img/provision/Bandage.png', count: 3 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 3 },
            { image: 'img/provision/Skeleton_Key.png', count: 3 },
            { image: 'img/provision/Holy_Water.png', count: 4 },
            { image: 'img/provision/Torch.png', count: 16 },
          ]
        }
      }
    },
    warrens: {
      name: 'Warrens',
      type: 'basic',
      image: 'img/regions/warrens.png',
      provision: 'Bring food, medicine, and at least one torch per hero. A retribution or bleed resist item helps a lot.',
      provisionGrid: {
        short: {
          totalPrice: 3600,
          items: [
            { image: 'img/provision/Food.png', count: 12 },
            { image: 'img/provision/Shovel.png', count: 2 },
            { image: 'img/provision/Bandage.png', count: 1 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 3 },
            { image: 'img/provision/Skeleton_Key.png', count: 2 },
            { image: 'img/provision/Holy_Water.png', count: 2 },
            { image: 'img/provision/Torch.png', count: 10 },

          ]
        },
        mid: {
          totalPrice: 5600,
          items: [
            { image: 'img/provision/Firewood.png', count: 1 },
            { image: 'img/provision/Food.png', count: 18 },
            { image: 'img/provision/Shovel.png', count: 3 },
            { image: 'img/provision/Antivenom.png', count: 1 },
            { image: 'img/provision/Bandage.png', count: 2 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 4 },
            { image: 'img/provision/Skeleton_Key.png', count: 3 },
            { image: 'img/provision/Holy_Water.png', count: 3 },
            { image: 'img/provision/Torch.png', count: 16 }
          ]
        },
        long: {
          totalPrice: 6800,
          items: [
            { image: 'img/provision/Firewood.png', count: 2 },
            { image: 'img/provision/Food.png', count: 20 },
            { image: 'img/provision/Shovel.png', count: 4 },
            { image: 'img/provision/Antivenom.png', count: 1 },
            { image: 'img/provision/Bandage.png', count: 3 },
            { image: 'img/provision/Medicinal_Herbs.png', count: 5 },
            { image: 'img/provision/Skeleton_Key.png', count: 3 },
            { image: 'img/provision/Holy_Water.png', count: 4 },
            { image: 'img/provision/Torch.png', count: 20 }
          ]
        }
      },
      tips: 'Prioritize crowd control, remove plague stacks quickly, and consider a frontline hero that can tank nasty crits.'
    },
    cove: {
      name: 'Cove',
      type: 'basic',
      image: 'img/regions/cove.png',
      provision: 'Take bandages, seafood, and blight-cleansing supplies. A stable healing source and stun is valuable.',
      tips: 'Bring heroes that can handle bleed, keep morale steady, and avoid early cave-ins by moving carefully.'
    },
    weald: {
      name: 'Weald',
      type: 'basic',
      image: 'img/regions/weald.png',
      provision: 'Carry torches, poison cure, and stress relief items. Extra scouting helps uncover enemies early.',
      tips: 'Manage food and stress, use debuffs on dangerous foes, and don’t let surprise attacks stack up.'
    },
    'crimson-court': {
      name: 'Crimson Court',
      type: 'crimson',
      image: 'img/regions/court.png',
      provision: 'Bring plague cure, bandages, and stealth options. Keep torches up and manage resistances carefully.',
      tips: 'Use heroes that can handle bleed and disease, don’t overextend, and retreat when necessary.'
    },
    'color-of-madness': {
      name: 'Color of Madness',
      type: 'madness',
      image: 'img/regions/windmill.png',
      provision: 'Bring protection from madness, strong healing, and high damage output. Be ready for randomized encounters.',
      tips: 'Focus on damage, avoid prolonged fights, and leverage heroes who can handle unpredictable attacks.'
    },
    town: {
      name: 'Town',
      type: 'town',
      image: 'img/regions/town.png',
      provision: 'Bring only essential supplies and a small team that can complete short missions quickly.',
      tips: 'Use the Town for quick preparation and short objective runs. Avoid overcommitting your party.'
    },
    darkest: {
      name: 'Darkest Dungeon',
      type: 'darkest',
      image: 'img/regions/dd1.png',
      provision: 'Bring top-tier healing, stress relief, and strong camping supplies. The highest difficulty requires careful planning.',
      tips: 'Use the strongest party you have, manage health carefully, and expect waves of punishing encounters.'
    }
  },
  longevityOptions: {
    basic: [
      { value: 'short', label: 'Short' },
      { value: 'mid', label: 'Mid' },
      { value: 'long', label: 'Long' }
    ],
    crimson: [
      { value: 'short', label: 'Short' },
      { value: 'epic', label: 'Epic' }
    ],
    madness: [
      { value: 'short', label: 'Short' },
      { value: 'endless', label: 'Endless' }
    ],
    town: [
      { value: 'short', label: 'Short' }
    ],
    darkest: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' }
    ]
  }
};