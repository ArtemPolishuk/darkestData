window.DarkestDataTips = {
  en: {
    ruins: {
      enemyTypes: [
        'Unholy (!)',
        'Human',
      ],
      effective: [
        'Blight',
        'DMG vs Unholy',
        'Physical DMG',
      ],
      ineffective: [
        'Bleed',
      ],
      resistances: [
        { label: 'Frontline:', notes: ['Stun / Move (!)', 'Bleed'] },
        { label: 'Backline:', notes: ['Stun'] },
      ],
      recommendations: [
        { label: 'Bring extra Food' },
		    { label: 'Bring extra cures for:', notes: ['Bleed'] },
        { label: 'Viable counter tools are:', notes: ['Stun / Move', 'Guard-break', 'Corpse removal'] },
      ],
      dangers: [
        { label: 'Bone Bearer', notes: ['Buff / Revive allies'] },
        { label: 'Bone Captain', notes: ['High DMG from frontline', 'Party-wide Stun'] },
        { label: 'Bone Defender', notes: ['Move / Stun frontline', 'Guard allies'] },
        { label: 'Bone Spearman', notes: ['Party-wide DMG from frontline'] },
        { label: 'Bone Arbalist', notes: ['High DMG from backline', 'DMG vs Marked'] },
        { label: 'Bone Courtiers', notes: ['Inflicts Stress from backline'] },
      ],
    },
    warrens: {
      enemyTypes: [
        'Beast (!)',
        'Human (!)',
      ],
      effective: [
        'Bleed',
        'DMG vs Beast',
        'DMG vs Human',
      ],
      ineffective: [
        'Blight',
      ],
      resistances: [
        { label: 'Frontline:', notes: ['Stun / Move (!)', 'Bleed / Disease',] },
        { label: 'Backline:', notes: ['Stun (!)', 'Blight / Disease',] },
      ],
      recommendations: [
        'Avoid being Marked',
        'Increase Scouting',
		{ label: 'Bring extra cures for:', notes: ['Bleed / Blight / Disease'] },
        { label: 'Viable counter tools are:', notes: ['Stun / Move', 'Guard'] },
      ],
      dangers: [
        { label: 'Swine Skiver', notes: ['Move / Stun frontline', 'Blight backline', 'High DMG from backline'] },
        { label: 'Large Corpse Eater', notes: ['Applies Marks', 'DMG vs Marked', 'High DMG'] },
        { label: 'Swinetaur', notes: ['Move / Stun frontline', 'High DMG from backline'] },
        { label: 'Swine Chopper', notes: ['Move / Stun backline', 'Bleed frontline'] },
        { label: 'Swine Wretch', notes: ['Inflicts Disease', 'Inflicts Stress'] },
        { label: 'Swine Drummer', notes: ['Inflicts Stress', 'Applies Marks'] },
      ],
    },
    cove: {
      enemyTypes: ['Eldritch (!)', 'Unholy'],
      effective: ['Blight', 'DMG vs Eldritch', 'Armor Piercing'],
      ineffective: ['Bleed'],
      resistances: [
		{ label: 'Frontline:', notes: ['Stun / Move / Bleed (!)',] },
        { label: 'Backline:', notes: ['Move (!)', 'Stun'] },
	  ],
      recommendations: [
		{ label: 'Bring extra cures for:', notes: ['Bleed / Debuff'] },
		{ label: 'Viable counter tools are:', notes: ['Stun / Guard-break'] },
	  ],
      dangers: [
        { label: 'Uca Major', notes: ['Move / Stun / Bleed frontline'] },
        { label: 'Pelagic Grouper', notes: ['High DMG from frontline', 'Move backline'] },
        { label: 'Pelagic Shaman', notes: ['Inflicts Stress', 'Buff / Heal allies'] },
        { label: 'Pelagic Guardian', notes: ['Guard allies', 'Bleed frontline'] },
        { label: 'Drowned Thrall', notes: ['Party-wide DMG', 'Inflicts Stress'] },
      ],
    },
    weald: {
      enemyTypes: [],
      effective: [],
      ineffective: [],
      resistances: [],
      recommendations: [],
      dangers: [],
    },
  },
  uk: {
    ruins: {
      enemyTypes: [
        'Скелети та неживі люди',
        'Bone Rabble, Bone Arbalist, Bone Courtier, Bone Defender, Bone Veteran',
      ],
      effective: [
        'Отрута та сильна шкода по задньому ряду',
        'Контроль, оглушення та висока влучність',
      ],
      ineffective: [
        'Шкода через кровотечу',
        'Команди, які не дістають до задньої лінії',
      ],
      resistances: [],
      recommendations: [
        'Crusader',
        'Отрута',
        'Шкода по неживих',
      ],
      dangers: [
        'Стрес від Bone Courtier і тиск на задню лінію',
        'Небезпечні танки на фронті, якщо їх не прибрати швидко',
      ],
    },
    warrens: {
      enemyTypes: [],
      effective: [],
      ineffective: [],
      resistances: [],
      recommendations: [],
      dangers: [],
    },
    cove: {
      enemyTypes: [],
      effective: [],
      ineffective: [],
      resistances: [],
      recommendations: [],
      dangers: [],
    },
    weald: {
      enemyTypes: [],
      effective: [],
      ineffective: [],
      resistances: [],
      recommendations: [],
      dangers: [],
    },
  },
};
