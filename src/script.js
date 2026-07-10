window.DarkestData = window.DarkestData || {};
window.DarkestDataI18n = window.DarkestDataI18n || {};

const fallbackDarkestData = {
	regionContent: window.DarkestData.regionContent || {},
	longevityOptions: window.DarkestData.longevityOptions || {}
};

const fallbackI18n = {
	defaultLocale: 'en',
	locales: {
		en: {
			documentTitle: 'Darkest Data',
			logoAlt: 'Darkest Data logo',
			languageLabel: 'Language',
			regionHeading: 'Region',
			chooseRegion: 'Choose a region:',
			chooseLongevity: 'Choose longevity:',
			chooseLevel: 'Choose level:',
			provisionHeading: 'Provision',
			tipsHeading: 'Tips',
			bossTabsLabel: 'Boss comps tabs',
			curiosTab: 'Curios',
			bossesTab: 'Bosses',
			heroesTab: 'Heroes',
			regionPreviewAlt: '{name} region preview',
			footerText: 'This is an unofficial fan-made guide. Not affiliated with Red Hook Studios.',
			panelContent: {
				curios: 'Curios content goes here. Add your dungeon curios details and interactions.',
				bosses: 'Bosses content goes here. Add boss fight information, resistances, and notes.',
				heroes: 'Heroes content goes here. Add recommended party compositions and hero tips.'
			},
			regionNames: {
				ruins: 'Ruins',
				warrens: 'Warrens',
				cove: 'Cove',
				weald: 'Weald',
				'weald-shrieker': 'Weald (Shrieker)',
				town: 'Town',
				'color-of-madness': 'Color of Madness',
				darkest: 'Darkest Dungeon'
			},
			regionTexts: {}
		}
	}
};

const { regionContent, longevityOptions } = window.DarkestData.regionContent ? window.DarkestData : fallbackDarkestData;
const { defaultLocale, locales } = window.DarkestDataI18n.locales ? window.DarkestDataI18n : fallbackI18n;
const curiosByLocation = window.DarkestDataCurios || { ruins: [] };

const localeSelect = document.getElementById('locale-select');
const documentTitle = document.title;
const logoImage = document.querySelector('img[alt="Darkest Data logo"]');
const regionSelect = document.getElementById('region-select');
const localeLabel = document.getElementById('locale-label');
const regionHeading = document.getElementById('region-heading');
const regionLabel = document.getElementById('region-label');
const longevityLabel = document.getElementById('longevity-label');
const longevitySelect = document.getElementById('longevity-select');
const regionPreview = document.getElementById('region-preview');
const regionPreviewLink = document.getElementById('region-preview-link');
const provisionHeading = document.getElementById('provision-heading');
const regionProvisionGrid = document.getElementById('region-provision-grid');
const regionProvisionTotal = document.getElementById('region-provision-total');
const regionProvisionTotalValue = document.getElementById('region-provision-total-value');
const regionProvision = document.getElementById('region-provision');
const regionProvisionPriority = document.getElementById('region-provision-priority');
const regionProvisionPriorityList = document.getElementById('region-provision-priority-list');
const tipsHeading = document.getElementById('tips-heading');
const regionTips = document.getElementById('region-tips');
const bossTabs = document.querySelector('.boss-tabs');
const curiosSearch = document.querySelector('.curios-search');
const curiosTab = document.getElementById('curios-tab');
const bossesTab = document.getElementById('bosses-tab');
const heroesTab = document.getElementById('heroes-tab');
const curioSearchInput = document.getElementById('curio-search');
const curiosPanelText = document.getElementById('curios-panel-text');
const bossesPanelText = document.getElementById('bosses-panel-text');
const heroesPanelText = document.getElementById('heroes-panel-text');
const footerText = document.querySelector('footer p');
const provisionEmptySlotImage = 'img/provision/empty.png';
const provisionStackLimits = {
	Food: 12,
	Shovel: 4,
	Torch: 8,
	Firewood: 1,
	default: 6
};

const provisionPrices = {
	Food: 75,
	Torch: 75,
	Shovel: 250,
	Bandage: 150,
	Medicinal_Herbs: 200,
	Skeleton_Key: 200,
	Holy_Water: 150,
	Antivenom: 150,
	Firewood: 0,
	Dog_Treats: 0
};

const provisionWikiLinks = {
	Food: 'https://darkestdungeon.fandom.com/wiki/Food',
	Shovel: 'https://darkestdungeon.fandom.com/wiki/Shovel',
	Bandage: 'https://darkestdungeon.fandom.com/wiki/Bandage',
	Medicinal_Herbs: 'https://darkestdungeon.fandom.com/wiki/Medicinal_Herbs',
	Skeleton_Key: 'https://darkestdungeon.fandom.com/wiki/Skeleton_Key',
	Holy_Water: 'https://darkestdungeon.fandom.com/wiki/Holy_Water',
	Torch: 'https://darkestdungeon.fandom.com/wiki/Torch',
	Firewood: 'https://darkestdungeon.fandom.com/wiki/Firewood',
	Antivenom: 'https://darkestdungeon.fandom.com/wiki/Antivenom'
};

const provisionPriorityGroups = {
	ruins: [
		[
			{ name: 'Holy_Water', label: 'Holy water' },
			{ name: 'Skeleton_Key', label: 'Skeleton key' }
		],
		[
			{ name: 'Shovel', label: 'Shovel' }
		],
		[
			{ name: 'Medicinal_Herbs', label: 'Medicinal herbs' }
		],
		[
			{ name: 'Antivenom', label: 'Antivenom' },
		],
		[
			{ name: 'Bandage', label: 'Bandage' }
		]
	],
	warrens: [
		[
			{ name: 'Medicinal_Herbs', label: 'Medicinal herbs' }
		],
		[
			{ name: 'Skeleton_Key', label: 'Skeleton key' }
		],
		[
			{ name: 'Holy_Water', label: 'Holy water' },
			{ name: 'Bandage', label: 'Bandage' }
		],
		[
			{ name: 'Antivenom', label: 'Antivenom' }
		],
		[
			{ name: 'Shovel', label: 'Shovel' }
		]
	],
	cove: [
		[
			{ name: 'Medicinal_Herbs', label: 'Medicinal herbs' },
			{ name: 'Shovel', label: 'Shovel' }
		],
		[
			{ name: 'Holy_Water', label: 'Holy water' }
		],
		[
			{ name: 'Skeleton_Key', label: 'Skeleton key' }
		],
		[
			{ name: 'Antivenom', label: 'Antivenom' }
		],
		[
			{ name: 'Bandage', label: 'Bandage' }
		]
	],
	weald: [
		[
			{ name: 'Antivenom', label: 'Antivenom' },
			{ name: 'Bandage', label: 'Bandage' }
		],
		[
			{ name: 'Shovel', label: 'Shovel' }
		],
		[
			{ name: 'Skeleton_Key', label: 'Skeleton key' }
		],
		[
			{ name: 'Medicinal_Herbs', label: 'Medicinal herbs' }
		],
		[
			{ name: 'Holy_Water', label: 'Holy water' }
		]
	]
};

const regionWikiLinks = {
	ruins: 'https://darkestdungeon.fandom.com/wiki/Ruins',
	warrens: 'https://darkestdungeon.fandom.com/wiki/Warrens',
	cove: 'https://darkestdungeon.fandom.com/wiki/Cove',
	weald: 'https://darkestdungeon.fandom.com/wiki/Weald',
	town: 'https://darkestdungeon.fandom.com/wiki/Village',
	'crimson-court': 'https://darkestdungeon.fandom.com/wiki/The_Crimson_Court',
	'color-of-madness': 'https://darkestdungeon.fandom.com/wiki/The_Color_of_Madness',
	darkest: 'https://darkestdungeon.fandom.com/wiki/Darkest_Dungeon'
};

const enemyWikiLinks = {
	'Bone Bearer': 'https://darkestdungeon.fandom.com/wiki/Bone_Bearer',
	'Bone Courtier': 'https://darkestdungeon.fandom.com/wiki/Bone_Courtier',
	'Bone Spearman': 'https://darkestdungeon.fandom.com/wiki/Bone_Spearman',
	'Cultist Acolyte': 'https://darkestdungeon.fandom.com/wiki/Cultist_Acolyte',
	'Madman': 'https://darkestdungeon.fandom.com/wiki/Madman'
};

const storageKeys = {
	locale: 'darkest-data-locale',
	region: 'darkest-data-region',
	longevity: 'darkest-data-longevity',
	tab: 'darkest-data-tab'
};

const regionAliases = {
	'weald-shrieker': 'weald'
};

function readStoredValue(key) {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStoredValue(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Ignore storage failures in private mode or restricted environments.
	}
}

function getLocale() {
	const fallbackLocale = defaultLocale || 'en';
	const selectedLocale = localeSelect?.value || fallbackLocale;
	return selectedLocale === 'en' && locales[selectedLocale] ? selectedLocale : fallbackLocale;
}

function applyStoredLocale() {
	if (localeSelect) {
		localeSelect.value = 'en';
	}
}

function applyStoredRegion() {
	const storedRegion = readStoredValue(storageKeys.region);
	if (storedRegion && regionContent[storedRegion]) {
		regionSelect.value = storedRegion;
	}
}

function applyStoredLongevity() {
	const storedLongevity = readStoredValue(storageKeys.longevity);
	if (storedLongevity) {
		longevitySelect.value = storedLongevity;
	}
}

function getResolvedRegionKey(regionKey) {
	return regionAliases[regionKey] || regionKey;
}

function getText(key, fallback) {
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	return key.split('.').reduce((value, part) => value && value[part], locale) || fallback;
}

function formatTemplate(template, values) {
	return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function setSelectOptions(selectElement, options, labelResolver) {
	const previous = selectElement.value;
	selectElement.innerHTML = options.map(option => `<option value="${option.value}">${labelResolver(option)}</option>`).join('');
	selectElement.value = options.some(option => option.value === previous) ? previous : options[0].value;
}

function getLocalizedRegionName(regionKey) {
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	const resolvedRegionKey = getResolvedRegionKey(regionKey);
	return locale.regionNames[regionKey] || locale.regionNames[resolvedRegionKey] || regionContent[resolvedRegionKey]?.name || regionKey;
}

function getLocalizedLongevityLabel(value, fallbackLabel) {
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	return locale.longevityLabels[value] || fallbackLabel;
}

function getProvisionStackLimit(item) {
	const rawName = item?.label || item?.alt || item?.image?.split('/').pop().replace(/\.[^.]+$/, '') || '';
	const normalizedName = rawName.replace(/_/g, ' ').trim();
	const compactName = normalizedName.replace(/\s+/g, '');
	return provisionStackLimits[normalizedName] || provisionStackLimits[compactName] || provisionStackLimits.default;
}

function getProvisionItemName(item) {
	return item?.label || item?.alt || item?.image?.split('/').pop().replace(/\.[^.]+$/, '') || '';
}

function getProvisionItemPrice(item) {
	const rawName = getProvisionItemName(item);
	const normalizedName = rawName.replace(/_/g, ' ').trim();
	const compactName = normalizedName.replace(/\s+/g, '_');
	return Number(provisionPrices[rawName] ?? provisionPrices[compactName] ?? provisionPrices[normalizedName] ?? 0) || 0;
}

function getProvisionItemHref(item) {
	const rawName = getProvisionItemName(item);
	const normalizedName = rawName.replace(/_/g, ' ').trim();
	const compactName = normalizedName.replace(/\s+/g, '_');
	return provisionWikiLinks[rawName] || provisionWikiLinks[compactName] || `https://darkestdungeon.fandom.com/wiki/${compactName}`;
}

function normalizeProvisionStacks(items) {
	return items.flatMap(item => {
		const count = Number(item?.count) || 0;
		const stackLimit = Math.max(1, getProvisionStackLimit(item));
		if (count <= stackLimit) {
			return [item];
		}

		const stacks = [];
		let remaining = count;
		while (remaining > 0) {
			const stackCount = Math.min(stackLimit, remaining);
			stacks.push({ ...item, count: stackCount });
			remaining -= stackCount;
		}
		return stacks;
	});
}

function calculateProvisionTotal(items) {
	return (items || []).reduce((total, item) => total + (Number(item?.count) || 0) * getProvisionItemPrice(item), 0);
}

function formatProvisionTotal(value) {
	return Number(value || 0).toLocaleString('en-US');
}

function formatTipItem(item) {
	const text = String(item || '');
	if (/^DMG vs Unholy$/i.test(text)) {
		return '<span class="tip-trinket"><span class="tip-trinket-label">DMG vs Unholy</span><span class="tip-trinket-card" role="tooltip"><span class="tip-trinket-text"><span class="tip-trinket-title">Unholy Slayer\'s Ring</span><span class="tip-trinket-stats">+25% DMG vs Unholy<br>-8 DODGE</span></span><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-unholy_slayers_ring.webp" alt="Unholy Slayer\'s Ring"></span></span>';
	}
	if (/^blight$/i.test(text)) {
		return '<span class="tip-status tip-status-blight"><span>Blight</span><img class="tip-status-icon" src="img/effects/Poptext_poison.webp" alt="" aria-hidden="true"></span>';
	}
	if (/^bleed$/i.test(text)) {
		return '<span class="tip-status tip-status-bleed"><span>Bleed</span><img class="tip-status-icon" src="img/effects/Poptext_bleed.webp" alt="" aria-hidden="true"></span>';
	}
	if (/\bstress\b/i.test(text)) {
		return text.replace(/\bstress\b/gi, match => `<span class="tip-status tip-status-stress"><span>${match.charAt(0).toUpperCase()}${match.slice(1).toLowerCase()}</span><img class="tip-status-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span>`);
	}
	if (/^crusader$/i.test(text)) {
		return '<span class="hero-tip"><a class="hero-name" href="https://darkestdungeon.fandom.com/wiki/Crusader" target="_blank" rel="noopener noreferrer">Crusader</a><span class="hero-tip-card" role="tooltip"><span class="hero-tip-text"><span class="hero-tip-title">Crusader</span><span class="hero-tip-stats">+35% DMG vs Unholy on main damage skills</span></span><img class="hero-tip-image" src="img/heroIcons/crusader_portrait_roster.png" alt="Crusader"></span></span>';
	}
	return text;
}

function formatDangerText(text) {
	return String(text || '')
		.replace(/(Bone Courtiers?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Courtier']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Courtier.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Spearman?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Spearman']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Solider.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Cultist Acolytes?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Cultist Acolyte']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Cultist_Acolyte.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Madmen)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks.Madman}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Madman.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/\s+,/g, ',');
}

function formatCurioText(text) {
	return String(text || '')
		.replace(/(Bookshelf)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--curio" href="https://darkestdungeon.fandom.com/wiki/Bookshelf" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/curios/Bookshelf.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Stack of Books)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--curio" href="https://darkestdungeon.fandom.com/wiki/Stack_of_Books" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/curios/Stack_of_Books.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/\s+,/g, ',');
}

function formatRecommendationText(text) {
	return escapeHtml(String(text || ''))
		.replace(/\bFood\b/gi, '<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Food" target="_blank" rel="noopener noreferrer">Food</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Food.png" alt="Food"></span></span>');
}

function formatEnemyText(text) {
	return String(text || '')
		.replace(/(Bone Bearer)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Bearer']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Bearer.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/\s+,/g, ',');
}

function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function formatCurioAmount(amount) {
	if (amount === undefined || amount === null || amount === '') {
		return '';
	}
	return String(amount).replace(/\.0+$/, '');
}

function getCurioOutcomeLabelIcon(label) {
	const normalized = String(label || '').toLowerCase();

	if (!normalized) {
		return '';
	}
	if (normalized.includes('nothing')) {
		return 'img/effects/Nothing.curio_tracker.webp';
	}
	if (normalized.includes('purge')) {
		return 'img/effects/Purge_neg.curio_tracker.webp';
	}
	if (normalized.includes('heal') && normalized.includes('stress')) {
		return 'img/effects/Heal_stress.curio_tracker.webp';
	}
	if (normalized.includes('stress')) {
		return 'img/effects/stress.webp';
	}
	if (normalized.includes('debuff resist')) {
		return 'img/effects/Buff.curio_tracker.webp';
	}
	if (normalized.includes('debuff')) {
		return 'img/effects/Poptext_debuff.webp';
	}
	if (normalized.includes('buff')) {
		return 'img/effects/Buff.curio_tracker.webp';
	}
	if (normalized.includes('food')) {
		return 'img/effects/Loot.curio_tracker.webp';
	}
	if (normalized.includes('disease')) {
		return 'img/effects/Poptext_disease.webp';
	}
	if (normalized.includes('positive quirk') || normalized.includes('ruins adventurer') || normalized.includes('ruins tactician')) {
		return 'img/effects/Quirk_pos.curio_tracker.webp';
	}
	if (normalized.includes('bleed')) {
		return 'img/effects/Poptext_bleed.webp';
	}
	if (normalized.includes('negative quirk')) {
		return 'img/effects/Quirk_neg.curio_tracker.webp';
	}
	if (normalized.includes('blight')) {
		return 'img/effects/Poptext_poison.webp';
	}
	if (normalized.includes('scout') || normalized.includes('scouting')) {
		return 'img/effects/Scout_Ahead.webp';
	}
	if (normalized.includes('decrease light by 25') || normalized.includes('decrease light')) {
		return 'img/effects/Torch_up.curio_tracker.webp';
	}
	if (normalized.includes('set light to 100') || normalized.includes('light to 100')) {
		return 'img/effects/Torch_up.curio_tracker.webp';
	}
	if (normalized.includes('summon shambler')) {
		return 'img/effects/Room_boss.webp';
	}
	if (normalized.includes('torch')) {
		return 'img/effects/Torch_up.curio_tracker.webp';
	}
	if (normalized.includes('special trinket') || normalized.includes('puzzling trapezohedron')) {
		return 'img/effects/Loot.curio_tracker.webp';
	}
	if (normalized.includes('heirloom')) {
		return 'img/effects/Currency.portrait.icon.webp';
	}
	if (normalized.includes('loot') || normalized.includes('gold') || normalized.includes('gems') || normalized.includes('money') || normalized.includes('any loot')) {
		return 'img/effects/Loot.curio_tracker.webp';
	}

	return '';
}

function renderCurioOutcome(outcome) {
	const amount = formatCurioAmount(outcome?.amount);
	const label = String(outcome?.type?.label || '');
	const labelIcon = getCurioOutcomeLabelIcon(label);
	return `
		<div class="curio-outcome">
			${outcome?.chances !== 100 ? `<span class="curio-outcome-chances">${escapeHtml(outcome?.chances)}%</span>` : ''}
			<span class="curio-outcome-label">
				${labelIcon ? `<img class="curio-outcome-label-icon" src="${escapeHtml(labelIcon)}" alt="">` : ''}
				<span class="curio-outcome-label-text">${escapeHtml(label)}${amount ? `<span class="curio-outcome-amount">x${escapeHtml(amount)}</span>` : ''}</span>
			</span>
		</div>
	`;
}

function renderCurioOption(option) {
	const isNothing = /nothing/i.test(String(option?.activator?.label || ''));
	const activatorClass = /nothing/i.test(String(option?.activator?.label || ''))
		? 'curio-option-activator-icon curio-option-activator-icon--nothing'
		: 'curio-option-activator-icon curio-option-activator-icon--curio';

	return `
		<div class="curio-option ${isNothing ? 'curio-option--nothing' : 'curio-option--curio'}">
			<div class="curio-option-activator">
				<img class="${activatorClass}" src="${escapeHtml(option?.activator?.icon || '')}" alt="${escapeHtml(option?.activator?.label || '')}">
			</div>
			<div class="curio-option-outcomes">
				${(option?.outcomes || []).map(renderCurioOutcome).join('')}
			</div>
		</div>
	`;
}

function renderCurioCard(curio) {
	const optionCount = Math.max(1, Math.min((curio?.options || []).length || 1, 3));
	return `
		<article class="curio-card" style="--curio-option-columns: ${optionCount};">
			<div class="curio-header">
				<h4 class="curio-name">${escapeHtml(curio?.name || '')}</h4>
				<img class="curio-icon" src="${escapeHtml(curio?.icon || '')}" alt="${escapeHtml(curio?.name || '')}">
			</div>
			<div class="curio-options">
				${(curio?.options || []).map(renderCurioOption).join('')}
			</div>
		</article>
	`;
}

function renderCuriosPanel(location) {
	if (!curiosPanelText) {
		return;
	}

	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	const curios = curiosByLocation[location] || [];
	const query = String(curioSearchInput?.value || '').trim().toLowerCase();
	const filteredCurios = query
		? curios.filter(curio => String(curio?.name || '').toLowerCase().includes(query))
		: curios;
	if (!curios.length) {
		curiosPanelText.innerHTML = `<p class="curios-placeholder">${escapeHtml(locale.panelContent.curios)}</p>`;
		return;
	}

	if (!filteredCurios.length) {
		curiosPanelText.innerHTML = `<p class="curios-placeholder">No curios found for "${escapeHtml(query)}".</p>`;
		return;
	}

	curiosPanelText.innerHTML = `<div class="curio-list">${filteredCurios.map(renderCurioCard).join('')}</div>`;
}

function renderProvisionPriority(location) {
	const groups = provisionPriorityGroups[location] || provisionPriorityGroups.ruins || [];
	return groups.map((group, groupIndex) => `
		<div class="provision-priority-row">
			${(Array.isArray(group) ? group : []).map((item, itemIndex) => `
				<a class="provision-priority-item${item.name === 'Food' ? ' provision-priority-item--food' : ''}" href="${provisionWikiLinks[item.name]}" title="${item.label || item.name || ''}" target="_blank" rel="noopener noreferrer">
					<img src="img/provision/${item.name}.png" alt="${item.label}">
					<span>${item.label}</span>
				</a>
			`).join('')}
		</div>
		${groupIndex < groups.length - 1 ? '<div class="provision-priority-arrow">↓</div>' : ''}
	`).join('');
}

function renderRegionTips(tips) {
	if (tips && typeof tips === 'object' && !Array.isArray(tips)) {
		const renderGroup = (title, items) => {
			if (!Array.isArray(items) || !items.length) {
				return '';
			}

			const shouldFormat = title === 'Dangers:' || title === 'Recommendations:';
			return `
			<div class="tip-group">
				<strong>${title}</strong>
				<ul>
					${items.map(item => `<li>${title === 'Recommendations:' ? formatRecommendationText(item) : shouldFormat ? formatTipItem(formatEnemyText(formatCurioText(formatDangerText(item)))) : formatTipItem(item)}</li>`).join('')}
				</ul>
			</div>
			`;
		};

		const stressTargets = (tips.dangers || [])
			.filter(item => /^Stress\s+from\s+/i.test(String(item || '')))
			.flatMap(item => {
				const text = String(item || '');
				const match = text.match(/^Stress\s+from\s+(.+?)(\s+enemies?)?$/i);
				if (!match) {
					return [];
				}
				return (match[1] || '')
					.split(/\s*\/\s*/)
					.map(part => part.trim())
					.filter(Boolean);
			})
			.reduce((list, item) => (list.includes(item) ? list : [...list, item]), []);
		let stressRendered = false;
		const dangerItems = [
			...(tips.dangers || []).filter(item => !/^Stress\s+from\s+/i.test(String(item || ''))),
			...(tips.dangers || []).filter(item => /^Stress\s+from\s+/i.test(String(item || '')))
		];

		const renderDangerItem = item => {
			const text = String(item || '');
			const stressMatch = text.match(/^(Stress)\s+from\s+(.+?)(\s+enemies?)?$/i);
			if (!stressMatch) {
				return `<li>${formatTipItem(formatEnemyText(formatCurioText(formatDangerText(text))))}</li>`;
			}
			if (stressRendered) {
				return '';
			}
			stressRendered = true;

			return `
				<li class="tip-danger-parent">
					<span class="tip-danger-stress"><span class="tip-danger-stress-label">${escapeHtml(stressMatch[1])}</span><img class="tip-danger-stress-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span> from ${stressTargets.map(target => formatTipItem(formatEnemyText(formatCurioText(formatDangerText(target))))).join(' / ')}
				</li>
			`;
		};

		return `
			<div class="tip-triple">
				${renderGroup('Enemy types:', tips.enemyTypes)}
				${renderGroup('Effective:', tips.effective)}
				${renderGroup('Ineffective:', tips.ineffective)}
			</div>
			<br />
			${renderGroup('Recommendations:', tips.recommendations)}
			<br />
			<div class="tip-group">
				<strong>Dangers:</strong>
				<ul>
					${dangerItems.map(renderDangerItem).join('')}
				</ul>
			</div>
		`;
	}

		return `<p>${formatTipItem(tips || '')}</p>`;
}

function renderStaticText() {
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	document.title = locale.documentTitle;
	if (logoImage) {
		logoImage.alt = locale.logoAlt;
	}
	if (localeLabel) {
		localeLabel.textContent = locale.languageLabel;
	}
	regionHeading.textContent = locale.regionHeading;
	regionLabel.textContent = locale.chooseRegion;
	provisionHeading.textContent = locale.provisionHeading;
	tipsHeading.textContent = locale.tipsHeading;
	bossTabs.setAttribute('aria-label', locale.bossTabsLabel);
	curiosTab.textContent = locale.curiosTab;
	bossesTab.textContent = locale.bossesTab;
	heroesTab.textContent = locale.heroesTab;
	if (curiosPanelText) {
		curiosPanelText.innerHTML = '';
	}
	bossesPanelText.textContent = locale.panelContent.bosses;
	heroesPanelText.textContent = locale.panelContent.heroes;
	footerText.innerHTML = locale.footerText;
}
function getCurrentImage(current) {
	if (current.type === 'darkest') {
		const level = ['1', '2', '3', '4'].includes(longevitySelect.value) ? longevitySelect.value : '1';
		return `img/regions/dd${level}.png`;
	}
	return current.image;
}

function updateLongevityOptions() {
	const currentRegionKey = getResolvedRegionKey(regionSelect.value);
	const current = regionContent[currentRegionKey] || regionContent.ruins;
	const options = longevityOptions[current.type] || longevityOptions.basic;
	setSelectOptions(longevitySelect, options, option => getLocalizedLongevityLabel(option.value, option.label));
	const storedLongevity = readStoredValue(storageKeys.longevity);
	if (storedLongevity && options.some(option => option.value === storedLongevity)) {
		longevitySelect.value = storedLongevity;
	}
	longevityLabel.textContent = current.type === 'darkest'
		? getText('chooseLevel', 'Choose level:')
		: getText('chooseLongevity', 'Choose longevity:');
}

function updateRegionDisplay() {
	const currentRegionKey = getResolvedRegionKey(regionSelect.value);
	const current = regionContent[currentRegionKey] || regionContent.ruins;
	updateLongevityOptions();
	regionPreview.src = getCurrentImage(current);
	regionPreview.alt = formatTemplate(getText('regionPreviewAlt', '{name} preview'), { name: getLocalizedRegionName(regionSelect.value) });
	if (regionPreviewLink) {
		regionPreviewLink.href = regionWikiLinks[currentRegionKey] || regionWikiLinks.ruins;
	}
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	const regionTexts = locale.regionTexts || {};
	const regionText = regionTexts[currentRegionKey] || regionTexts[regionSelect.value] || {};
	const hasProvisionGrid = Boolean(current.provisionGrid);
	const provisionGridSet = current.provisionGrid?.[longevitySelect.value] || current.provisionGrid?.short || { items: [] };
	const provisionGrid = normalizeProvisionStacks(provisionGridSet.items || []);
	const provisionTotal = calculateProvisionTotal(provisionGrid);
	const provisionSlots = Array.from({ length: 16 }, (_, index) => provisionGrid[index] || null);
	regionProvision.hidden = hasProvisionGrid;
	regionProvisionGrid.hidden = !hasProvisionGrid;
	regionProvisionTotal.hidden = !hasProvisionGrid;
	if (regionProvisionPriority) {
		regionProvisionPriority.hidden = !provisionPriorityGroups[currentRegionKey];
	}
	regionProvisionGrid.setAttribute('aria-hidden', hasProvisionGrid ? 'false' : 'true');
	if (hasProvisionGrid) {
		regionProvisionTotalValue.textContent = formatProvisionTotal(provisionTotal);
		regionProvisionGrid.innerHTML = provisionSlots.map(item => item ? `
			<a class="provision-slot provision-slot-link${getProvisionItemName(item) === 'Food' ? ' provision-slot-link--food' : ''}" href="${getProvisionItemHref(item)}" title="${item.label || item.name || getProvisionItemName(item) || ''}" target="_blank" rel="noopener noreferrer">
				<img src="${item.image}" alt="${item.alt || item.label || item.image.split('/').pop().replace(/\.[^.]+$/, '')}">
				${item.count === 1 ? '' : `<span class="provision-count">${item.count}</span>`}
			</a>
		` : `
			<div class="provision-slot provision-slot-empty">
				<img src="${provisionEmptySlotImage}" alt="Empty slot">
			</div>
		`).join('');
		regionProvision.textContent = '';
		if (regionProvisionPriorityList) {
			regionProvisionPriorityList.innerHTML = renderProvisionPriority(currentRegionKey);
		}
	} else {
		regionProvisionGrid.innerHTML = '';
		regionProvisionGrid.hidden = true;
		regionProvisionTotalValue.textContent = formatProvisionTotal(0);
		regionProvision.innerHTML = formatTipItem(regionText.provision || current.provision);
		if (regionProvisionPriorityList) {
			regionProvisionPriorityList.innerHTML = '';
		}
	}
	const tips = regionText.tips || current.tips;
	regionTips.innerHTML = renderRegionTips(tips);
	renderCuriosPanel(currentRegionKey);
	writeStoredValue(storageKeys.region, regionSelect.value);
	writeStoredValue(storageKeys.longevity, longevitySelect.value);
}

regionSelect.addEventListener('change', () => {
	updateRegionDisplay();
});
longevitySelect.addEventListener('change', () => {
	writeStoredValue(storageKeys.longevity, longevitySelect.value);
	updateRegionDisplay();
});

const bossTabButtons = document.querySelectorAll('.boss-tab-button');
const bossTabPanels = document.querySelectorAll('.boss-tab-panel');
const disabledBossTabs = new Set(['bosses', 'heroes']);

function setBossTab(tabName) {
	const nextTab = disabledBossTabs.has(tabName) ? 'curios' : tabName;
	if (bossTabs) {
		bossTabs.classList.toggle('boss-tabs--curios-active', nextTab === 'curios');
	}
	if (curiosSearch) {
		curiosSearch.hidden = nextTab !== 'curios';
	}
	bossTabButtons.forEach(button => {
		const active = button.dataset.bossTab === nextTab;
		button.classList.toggle('active', active);
		button.setAttribute('aria-selected', active ? 'true' : 'false');
	});
	bossTabPanels.forEach(panel => {
		const visible = panel.dataset.bossPanel === nextTab;
		panel.classList.toggle('active', visible);
		panel.hidden = !visible;
	});
	writeStoredValue(storageKeys.tab, nextTab);
}

bossTabButtons.forEach(button => {
	button.addEventListener('click', () => setBossTab(button.dataset.bossTab));
});

curioSearchInput?.addEventListener('input', () => {
	renderCuriosPanel(getResolvedRegionKey(regionSelect.value));
});

localeSelect?.addEventListener('change', () => {
	writeStoredValue(storageKeys.locale, 'en');
	renderStaticText();
	updateRegionDisplay();
});

applyStoredLocale();
applyStoredRegion();
applyStoredLongevity();
renderStaticText();
setBossTab(readStoredValue(storageKeys.tab) || 'curios');
updateRegionDisplay();
