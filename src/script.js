window.DarkestData = window.DarkestData || {};
window.DarkestDataI18n = window.DarkestDataI18n || {};

const fallbackDarkestData = {
	regionContent: {
		ruins: {
			name: 'Ruins',
			type: 'basic',
			image: 'img/regions/ruins.png',
			provision: 'Pack torches, bandages, and anti-venom. A strong ranged party and stun are useful here.',
			tips: 'Avoid grouping heroes too tightly, stay aware of trap tiles, and bring bleed resist where possible.',
			provisionGrid: {
				short: {
					totalPrice: 21,
					items: [
					{ label: 'Torch', image: 'img/provision/Torch.png', count: 8 },
					{ label: 'Food', image: 'img/provision/Food.png', count: 8 },
					{ label: 'Shovel', image: 'img/provision/Shovel.png', count: 1 },
					{ label: 'Skeleton Key', image: 'img/provision/Skeleton_Key.png', count: 1 },
					{ label: 'Holy Water', image: 'img/provision/Holy_Water.png', count: 1 },
					{ label: 'Bandage', image: 'img/provision/Bandage.png', count: 2 }
				]
				},
				mid: {
					totalPrice: 33,
					items: [
					{ label: 'Torch', image: 'img/provision/Torch.png', count: 12 },
					{ label: 'Food', image: 'img/provision/Food.png', count: 12 },
					{ label: 'Shovel', image: 'img/provision/Shovel.png', count: 2 },
					{ label: 'Skeleton Key', image: 'img/provision/Skeleton_Key.png', count: 1 },
					{ label: 'Holy Water', image: 'img/provision/Holy_Water.png', count: 2 },
					{ label: 'Bandage', image: 'img/provision/Bandage.png', count: 4 }
				]
				},
				long: {
					totalPrice: 43,
					items: [
					{ label: 'Torch', image: 'img/provision/Torch.png', count: 16 },
					{ label: 'Food', image: 'img/provision/Food.png', count: 16 },
					{ label: 'Shovel', image: 'img/provision/Shovel.png', count: 3 },
					{ label: 'Skeleton Key', image: 'img/provision/Skeleton_Key.png', count: 2 },
					{ label: 'Holy Water', image: 'img/provision/Holy_Water.png', count: 2 },
					{ label: 'Bandage', image: 'img/provision/Bandage.png', count: 4 }
				]
				}
			}
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
				town: 'Town',
				'crimson-court': 'Crimson Court',
				'color-of-madness': 'Color of Madness',
				darkest: 'Darkest Dungeon'
			},
			regionTexts: {}
		}
	}
};

const { regionContent, longevityOptions } = window.DarkestData.regionContent ? window.DarkestData : fallbackDarkestData;
const { defaultLocale, locales } = window.DarkestDataI18n.locales ? window.DarkestDataI18n : fallbackI18n;

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
const tipsHeading = document.getElementById('tips-heading');
const regionTips = document.getElementById('region-tips');
const bossTabs = document.querySelector('.boss-tab-buttons');
const curiosTab = document.getElementById('curios-tab');
const bossesTab = document.getElementById('bosses-tab');
const heroesTab = document.getElementById('heroes-tab');
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

const storageKeys = {
	locale: 'darkest-data-locale',
	region: 'darkest-data-region',
	longevity: 'darkest-data-longevity',
	tab: 'darkest-data-tab'
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
	return locales[selectedLocale] ? selectedLocale : fallbackLocale;
}

function applyStoredLocale() {
	const storedLocale = readStoredValue(storageKeys.locale);
	if (storedLocale && locales[storedLocale]) {
		localeSelect.value = storedLocale;
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
	return locale.regionNames[regionKey] || regionContent[regionKey]?.name || regionKey;
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

function formatProvisionTotal(value) {
	return Number(value || 0).toLocaleString('en-US');
}

function renderRegionTips(tips) {
	if (tips && typeof tips === 'object' && !Array.isArray(tips)) {
		const sections = [
			['Enemy types:', tips.enemyTypes],
			['Effective:', tips.effective],
			['Ineffective:', tips.ineffective],
			['Dangers:', tips.dangers]
		];

		return sections.map(([title, items]) => `
			<strong>${title}</strong>
			<ul>
				${(items || []).map(item => `<li>${item}</li>`).join('')}
			</ul>
		`).join('');
	}

	return `<p>${tips || ''}</p>`;
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
	curiosPanelText.textContent = locale.panelContent.curios;
	bossesPanelText.textContent = locale.panelContent.bosses;
	heroesPanelText.textContent = locale.panelContent.heroes;
	footerText.textContent = locale.footerText;
}
function getCurrentImage(current) {
	if (current.type === 'darkest') {
		const level = ['1', '2', '3', '4'].includes(longevitySelect.value) ? longevitySelect.value : '1';
		return `img/regions/dd${level}.png`;
	}
	return current.image;
}

function updateLongevityOptions() {
	const current = regionContent[regionSelect.value] || regionContent.ruins;
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
	const current = regionContent[regionSelect.value] || regionContent.ruins;
	updateLongevityOptions();
	regionPreview.src = getCurrentImage(current);
	regionPreview.alt = formatTemplate(getText('regionPreviewAlt', '{name} preview'), { name: getLocalizedRegionName(regionSelect.value) });
	if (regionPreviewLink) {
		regionPreviewLink.href = regionWikiLinks[regionSelect.value] || regionWikiLinks.ruins;
	}
	const locale = locales[getLocale()] || locales[defaultLocale] || locales.en;
	const regionTexts = locale.regionTexts || {};
	const isRuins = regionSelect.value === 'ruins';
	const ruinsGridSet = current.provisionGrid?.[longevitySelect.value] || current.provisionGrid?.short || { items: [], totalPrice: 0 };
	const ruinsGrid = normalizeProvisionStacks(ruinsGridSet.items || []);
	const provisionTotal = Number(ruinsGridSet.totalPrice) || 0;
	const provisionSlots = Array.from({ length: 16 }, (_, index) => ruinsGrid[index] || null);
	regionProvision.hidden = isRuins;
	regionProvisionGrid.hidden = !isRuins;
	regionProvisionTotal.hidden = !isRuins;
	regionProvisionGrid.setAttribute('aria-hidden', isRuins ? 'false' : 'true');
	if (isRuins) {
		regionProvisionTotalValue.textContent = formatProvisionTotal(provisionTotal);
		regionProvisionGrid.innerHTML = provisionSlots.map(item => item ? `
			<a class="provision-slot provision-slot-link" href="${getProvisionItemHref(item)}" target="_blank" rel="noopener noreferrer">
				<img src="${item.image}" alt="${item.alt || item.label || item.image.split('/').pop().replace(/\.[^.]+$/, '')}">
				${item.count === 1 ? '' : `<span class="provision-count">${item.count}</span>`}
			</a>
		` : `
			<div class="provision-slot provision-slot-empty">
				<img src="${provisionEmptySlotImage}" alt="Empty slot">
			</div>
		`).join('');
		regionProvision.textContent = '';
	} else {
		regionProvisionGrid.innerHTML = '';
		regionProvisionGrid.hidden = true;
		regionProvisionTotalValue.textContent = formatProvisionTotal(0);
		regionProvision.textContent = regionTexts[regionSelect.value]?.provision || current.provision;
	}
	const tips = regionTexts[regionSelect.value]?.tips || current.tips;
	regionTips.innerHTML = renderRegionTips(tips);
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

function setBossTab(tabName) {
	bossTabButtons.forEach(button => {
		const active = button.dataset.bossTab === tabName;
		button.classList.toggle('active', active);
		button.setAttribute('aria-selected', active ? 'true' : 'false');
	});
	bossTabPanels.forEach(panel => {
		const visible = panel.dataset.bossPanel === tabName;
		panel.classList.toggle('active', visible);
		panel.hidden = !visible;
	});
	writeStoredValue(storageKeys.tab, tabName);
}

bossTabButtons.forEach(button => {
	button.addEventListener('click', () => setBossTab(button.dataset.bossTab));
});

localeSelect?.addEventListener('change', () => {
	writeStoredValue(storageKeys.locale, localeSelect.value);
	renderStaticText();
	updateRegionDisplay();
});

applyStoredLocale();
applyStoredRegion();
applyStoredLongevity();
renderStaticText();
setBossTab(readStoredValue(storageKeys.tab) || 'curios');
updateRegionDisplay();
