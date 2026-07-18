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

const provisionWikiLinks = (window.DarkestDataUrls && window.DarkestDataUrls.provision) || {};

const provisionPriorityGroups = window.DarkestDataProvisionPriority || {};

const regionWikiLinks = (window.DarkestDataUrls && window.DarkestDataUrls.regions) || {};

const enemyWikiLinks = (window.DarkestDataUrls && window.DarkestDataUrls.enemies) || {};

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

function positionTooltipCard(trigger) {
	if (!trigger) {
		return;
	}

	const card = trigger.querySelector('.tip-trinket-card, .hero-tip-card, .tip-recommendation-food-card');
	if (!card) {
		return;
	}

	window.requestAnimationFrame(() => {
		const triggerRect = trigger.getBoundingClientRect();
		const cardRect = card.getBoundingClientRect();
		const padding = 12;
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const isFoodTooltip = trigger.classList.contains('tip-recommendation-food-wrap');

		if (isFoodTooltip) {
			const centeredLeft = triggerRect.left + (triggerRect.width / 2) - (cardRect.width / 2);
			let shiftX = 0;

			if (centeredLeft < padding) {
				shiftX = padding - centeredLeft;
			} else if (centeredLeft + cardRect.width > viewportWidth - padding) {
				shiftX = (viewportWidth - padding) - (centeredLeft + cardRect.width);
			}

			card.style.setProperty('--tooltip-shift-x', `${shiftX}px`);
			card.classList.remove('tooltip-card--right');
			return;
		}
		const centeredTop = triggerRect.top + (triggerRect.height / 2) - (cardRect.height / 2);
		const spaceLeft = triggerRect.left - padding;
		const spaceRight = viewportWidth - triggerRect.right - padding;
		let shiftY = 0;
		let placeRight = false;

		if (centeredTop < padding) {
			shiftY = padding - centeredTop;
		} else if (centeredTop + cardRect.height > viewportHeight - padding) {
			shiftY = (viewportHeight - padding) - (centeredTop + cardRect.height);
		}

		if (spaceLeft < cardRect.width + 10 && spaceRight > spaceLeft) {
			placeRight = true;
		}

		card.style.setProperty('--tooltip-shift-y', `${shiftY}px`);
		card.classList.toggle('tooltip-card--right', placeRight);
	});
}

function setupTooltipPositioning() {
	const tooltipSelector = '.tip-trinket, .hero-tip, .tip-recommendation-food-wrap';
	const updateFromTarget = target => {
		const trigger = target?.closest?.(tooltipSelector);
		if (trigger) {
			positionTooltipCard(trigger);
		}
	};

	document.addEventListener('mouseenter', event => updateFromTarget(event.target), true);
	document.addEventListener('focusin', event => updateFromTarget(event.target), true);
	window.addEventListener('resize', () => {
		const activeTrigger = document.querySelector(`${tooltipSelector}:hover`) || document.activeElement?.closest?.(tooltipSelector);
		if (activeTrigger) {
			positionTooltipCard(activeTrigger);
		}
	});
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
		return '<span class="tip-trinket"><span class="tip-trinket-label">DMG vs Unholy</span><span class="tip-trinket-card" role="tooltip"><span class="tip-trinket-entity tip-trinket-entity--hero"><span class="tip-trinket-hero-text"><strong>Crusader</strong><span>+35% DMG vs Unholy</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-hero-icon" src="img/heroIcons/crusader_portrait_roster.png" alt="Crusader"></span></span><span class="tip-trinket-entity tip-trinket-entity--hero"><span class="tip-trinket-hero-text"><strong>Vestal</strong><span>+35% DMG vs Unholy</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-hero-icon" src="img/heroIcons/vestal_portrait_roster.png" alt="Vestal"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Unholy Slayer\'s Ring</span><span class="tip-trinket-stats">+25% DMG vs Unholy<br>-8 DODGE</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-unholy_slayers_ring.webp" alt="Unholy Slayer\'s Ring"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Necromancer\'s Collar</span><span class="tip-trinket-stats">+20% DMG vs Unholy<br>+8% CRIT vs Unholy</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Necromancer_Trinket.webp" alt="Necromancer\'s Collar"></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Unholy Hater</strong><span>+15% DMG vs Unholy<br>-15% Stress vs Unholy</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Unholy Slayer</strong><span>+10 ACC<br>+5% CRIT vs Unholy</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span></span></span>';
	}
	if (/^DMG vs Beast$/i.test(text)) {
		return '<span class="tip-trinket"><span class="tip-trinket-label">DMG vs Beast</span><span class="tip-trinket-card" role="tooltip"><span class="tip-trinket-entity tip-trinket-entity--hero"><span class="tip-trinket-hero-text"><strong>Houndmaster</strong><span>+35% DMG vs Beast<br>+60% DMG vs Marked</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-hero-icon" src="img/heroIcons/houndmaster_portrait_roster.png" alt="Houndmaster"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Beast Slayer\'s Ring</span><span class="tip-trinket-stats">+25% DMG vs Beast<br>-8 DODGE</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-beast_slayers_ring.webp" alt="Beast Slayer\'s Ring"></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Beast Hater</strong><span>+15% DMG vs Beast<br>-15% Stress vs Beast</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Beast Slayer</strong><span>+10 ACC<br>+5% CRIT vs Beast</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span></span></span>';
	}
	if (/^DMG vs Human$/i.test(text)) {
		return '<span class="tip-trinket"><span class="tip-trinket-label">DMG vs Human</span><span class="tip-trinket-card" role="tooltip"><span class="tip-trinket-entity tip-trinket-entity--hero"><span class="tip-trinket-hero-text"><strong>Bounty Hunter</strong><span>+35% DMG vs Human<br>+90% DMG vs Marked</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-hero-icon" src="img/heroIcons/bounty_hunter_portrait_roster.png" alt="Bounty Hunter"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Man Slayer\'s Ring</span><span class="tip-trinket-stats">+25% DMG vs Human<br>-8 DODGE</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-man_slayers_ring.webp" alt="Man Slayer\'s Ring"></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Man Hater</strong><span>+15% DMG vs Human<br>-15% Stress vs Human</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Man Slayer</strong><span>+10 ACC<br>+5% CRIT vs Human</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span></span></span>';
	}
	if (/^DMG vs Eldritch$/i.test(text)) {
		return '<span class="tip-trinket"><span class="tip-trinket-label">DMG vs Eldritch</span><span class="tip-trinket-card" role="tooltip"><span class="tip-trinket-entity tip-trinket-entity--hero"><span class="tip-trinket-hero-text"><strong>Occultist</strong><span>+35% DMG vs Eldritch</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-hero-icon" src="img/heroIcons/occultist_portrait_roster.png" alt="Occultist"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Eldritch Slayer\'s Ring</span><span class="tip-trinket-stats">+25% DMG vs Eldritch<br>-8 DODGE</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-eldritch_slayers_ring.webp" alt="Eldritch Slayer\'s Ring"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Ethereal Crucifix</span><span class="tip-trinket-stats">+25% DMG vs Eldritch<br>+30% Bleed Resist<br>-20% MAX HP</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-ethereal_crucifix.webp" alt="Ethereal Crucifix"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Eldritch Killing Incense</span><span class="tip-trinket-stats">+6% CRIT vs Eldritch<br>+15% DMG vs Eldritch</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Inv_trinket-eldritch_killing_incense.webp" alt="Eldritch Killing Incense"></span></span><span class="tip-trinket-entity tip-trinket-entity--trinket"><span class="tip-trinket-text"><span class="tip-trinket-title">Heretical Passage</span><span class="tip-trinket-stats">+20% Healing Skills<br>+25% DMG vs Husk<br>+25% DMG vs Eldritch<br><span>+10% <span class="tip-status tip-status-stress"><span>Stress</span><img class="tip-status-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span></span></span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-image" src="img/trinkets/Ves_heretical_passages.webp" alt="Heretical Passage"></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Eldritch Hater</strong><span>+15% DMG vs Eldritch<br>-15% Stress vs Eldritch</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span><span class="tip-trinket-entity tip-trinket-entity--quirk"><span class="tip-trinket-quirk-text"><strong>Eldritch Slayer</strong><span>+10 ACC<br>+5% CRIT vs Eldritch</span></span><span class="tip-trinket-entity-media"><img class="tip-trinket-quirk-icon" src="img/effects/Quirkicon_neg.webp" alt=""></span></span></span></span>';
	}
	if (/^blight$/i.test(text)) {
		return '<span class="tip-status tip-status-blight"><span>Blight</span><img class="tip-status-icon" src="img/effects/Poptext_poison.webp" alt="" aria-hidden="true"></span>';
	}
	if (/^bleed$/i.test(text)) {
		return '<span class="tip-status tip-status-bleed"><span>Bleed</span><img class="tip-status-icon" src="img/effects/Poptext_bleed.webp" alt="" aria-hidden="true"></span>';
	}
	if (/^stun(s)?$/i.test(text)) {
		return '<span class="tip-status tip-status-stun"><span>Stun</span><img class="tip-status-icon" src="img/effects/Poptext_stun.webp" alt="" aria-hidden="true"></span>';
	}
	if (/\bstress\b/i.test(text)) {
		return text.replace(/\bstress\b/gi, match => `<span class="tip-status tip-status-stress"><span>${match.charAt(0).toUpperCase()}${match.slice(1).toLowerCase()}</span><img class="tip-status-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span>`);
	}
	if (/^crusader$/i.test(text)) {
		return '<span class="hero-tip"><a class="hero-name" href="https://darkestdungeon.fandom.com/wiki/Crusader" target="_blank" rel="noopener noreferrer">Crusader</a><span class="hero-tip-card" role="tooltip"><span class="hero-tip-text"><span class="hero-tip-title">Crusader</span><span class="hero-tip-stats">+35% DMG vs Unholy<br>on main damage skills</span></span><img class="hero-tip-image" src="img/heroIcons/crusader_portrait_roster.png" alt="Crusader"></span></span>';
	}
	return text;
}

function formatResistanceText(text) {
	return String(text || '')
		.replace(/\b(move|stun|bleed)\b/gi, match => {
			const key = match.toLowerCase();
			const label = key.charAt(0).toUpperCase() + key.slice(1);
			const icon = key === 'move'
				? 'img/effects/Poptext_move.webp'
				: key === 'stun'
					? 'img/effects/Poptext_stun.webp'
					: 'img/effects/Poptext_bleed.webp';
			return `<span class="tip-status tip-status-${key} tip-resistance-status"><span>${label}</span><img class="tip-status-icon" src="${icon}" alt="" aria-hidden="true"></span>`;
		});
}

// Replaces status keywords with icon spans, only outside HTML tags
function applyInlineIcons(html) {
	const replacements = [
		[/(\bGuard-break\b)/gi, '<span class="tip-status tip-status-guardbreak"><span>Guard-break</span><img class="tip-status-icon" src="img/effects/Poptext_guard_break.webp" alt="" aria-hidden="true"></span>'],
		[/(\bGuard(?!-)\b)/gi, '<span class="tip-status tip-status-guard"><span>Guard</span><img class="tip-status-icon" src="img/effects/Poptext_guard.webp" alt="" aria-hidden="true"></span>'],
		[/(\bStun\b)/gi,        '<span class="tip-status tip-status-stun"><span>Stun</span><img class="tip-status-icon" src="img/effects/Poptext_stun.webp" alt="" aria-hidden="true"></span>'],
		[/(\bMove\b)/gi,        '<span class="tip-status tip-status-move"><span>Move</span><img class="tip-status-icon" src="img/effects/Poptext_move.webp" alt="" aria-hidden="true"></span>'],
		[/(\bKnockback\b)/gi,   '<span class="tip-status tip-status-move"><span>Knockback</span><img class="tip-status-icon" src="img/effects/Poptext_move.webp" alt="" aria-hidden="true"></span>'],
		[/(\bPush\b)/gi,        '<span class="tip-status tip-status-move"><span>Push</span><img class="tip-status-icon" src="img/effects/Poptext_move.webp" alt="" aria-hidden="true"></span>'],
		[/(\bBleed\b)/gi,       '<span class="tip-status tip-status-bleed"><span>Bleed</span><img class="tip-status-icon" src="img/effects/Poptext_bleed.webp" alt="" aria-hidden="true"></span>'],
		[/(\bBlight\b)/gi,      '<span class="tip-status tip-status-blight"><span>Blight</span><img class="tip-status-icon" src="img/effects/Poptext_poison.webp" alt="" aria-hidden="true"></span>'],
		[/\bBuff\b/gi,          '<span class="tip-status tip-status-buff"><span>Buff</span><img class="tip-status-icon tip-status-icon--buff" src="img/effects/Buff.curio_tracker.webp" alt="" aria-hidden="true"></span>'],
		[/\bDebuff\b/gi,        '<span class="tip-status tip-status-debuff"><span>Debuff</span><img class="tip-status-icon" src="img/effects/Poptext_debuff.webp" alt="" aria-hidden="true"></span>'],
		[/(\bStress\b)/gi,      '<span class="tip-status tip-status-stress"><span>Stress</span><img class="tip-status-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span>'],
		[/(\bFood\b)/gi,        '<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Food" target="_blank" rel="noopener noreferrer">Food</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Food.png" alt="Food"></span></span>'],
		[/(\bBandages?\b)/gi,   '<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Bandage" target="_blank" rel="noopener noreferrer">Bandage</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Bandage.png" alt="Bandage"></span></span>'],
		[/(\bAntivenoms?\b)/gi, '<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Antivenom" target="_blank" rel="noopener noreferrer">Antivenom</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Antivenom.png" alt="Antivenom"></span></span>'],
		[/(\bMarks\b)/gi,         '<span class="tip-status tip-status-marks"><span>Marks</span><img class="tip-status-icon" src="img/effects/Poptext_tagged.webp" alt="" aria-hidden="true"></span>'],
		[/(\bMark\b)/gi,          '<span class="tip-status tip-status-marks"><span>Mark</span><img class="tip-status-icon" src="img/effects/Poptext_tagged.webp" alt="" aria-hidden="true"></span>'],
		[/(\bMarked\b)/gi,        '<span class="tip-status tip-status-mark"><span>Marked</span><img class="tip-status-icon" src="img/effects/Tagdamage.webp" alt="" aria-hidden="true"></span>'],
		[/(\bCorpse removal\b)/gi, '<span class="tip-status tip-status-corpse-removal"><span>Corpse removal</span></span>'],
		[/\bDisease\b/gi,   '<span class="tip-status tip-status-disease"><span>Disease</span><img class="tip-status-icon" src="img/effects/Poptext_disease.webp" alt="" aria-hidden="true"></span>'],
		[/\bScouting\b/gi,  '<span class="tip-status tip-status-scouting"><span>Scouting</span><img class="tip-status-icon" src="img/effects/Scout_Ahead.webp" alt="" aria-hidden="true"></span>'],
		[/\bStealth\b/gi,   '<span class="tip-status tip-status-stealth"><span>Stealth</span><img class="tip-status-icon" src="img/effects/Tray_stealth.webp" alt="" aria-hidden="true"></span>'],
	];
	let result = html;
	for (const [pattern, replacement] of replacements) {
		result = result.replace(new RegExp(`(<[^>]*>)|${pattern.source}`, pattern.flags), (m, tag) => tag || replacement);
	}
	return result;
}

// Unified formatter: exact-match standalone items first, then full pipeline for rich text
function formatFullTipText(text) {
	const raw = String(text || '');
	const standalone = formatTipItem(raw);
	if (standalone !== raw) return standalone;
	const withLinks = formatEnemyText(formatCurioText(formatDangerText(raw)));
	return applyInlineIcons(withLinks);
}

function formatDangerText(text) {
	return String(text || '')
		.replace(/(Bone Arbalists?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Arbalist']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Arbalist.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Courtiers?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Courtier']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Courtier.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Defenders?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Defender']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Defender_attack_shield.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Spearman?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Spearman']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Solider.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Cultist Acolytes?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Cultist Acolyte']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Cultist_Acolyte.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Madman)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks.Madman}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Madman.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Swine Wretch\s?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Swine Wretch']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Swine_Wretch.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Swine Drummer\s?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Swine Drummer']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Swine_Drummer.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Large Corpse Eater\s?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Large Corpse Eater']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Carrion_Big.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Swine Skiver\s?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Swine Skiver']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Swine_Skiver.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Swinetaur\s?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Swinetaur']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Swinetaur.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/\s+,/g, ',');
}

function formatCurioText(text) {
	return String(text || '')
		.replace(/(Bookshelf)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--curio" href="https://darkestdungeon.fandom.com/wiki/Bookshelf" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/curios/Bookshelf.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Stack of Books)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--curio" href="https://darkestdungeon.fandom.com/wiki/Stack_of_Books" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/curios/Stack_of_Books.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/\s+,/g, ',');
}

function formatRecommendationText(text) {
	const recommendationText = escapeHtml(String(text || ''))
		.replace(/\bFood\b/gi, '<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Food" target="_blank" rel="noopener noreferrer">Food</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Food.png" alt="Food"></span></span>')
		.replace(/\bBandages?\b/gi, m => `<span class="tip-recommendation-food-wrap"><a class="tip-recommendation-food-link" href="https://darkestdungeon.fandom.com/wiki/Bandage" target="_blank" rel="noopener noreferrer">${m}</a><span class="tip-recommendation-food-card" role="tooltip"><img class="tip-recommendation-food-image" src="img/provision/Bandage.png" alt="Bandage"></span></span>`)
		.replace(/\bStun\b/gi, '<span class="tip-status tip-status-stun tip-recommendation-status"><span>Stun</span><img class="tip-status-icon" src="img/effects/Poptext_stun.webp" alt="" aria-hidden="true"></span>')
		.replace(/\bMove\b/gi, '<span class="tip-status tip-status-move tip-recommendation-status"><span>Move</span><img class="tip-status-icon" src="img/effects/Poptext_move.webp" alt="" aria-hidden="true"></span>')
		.replace(/\bGuard-break\b/gi, '<span class="tip-status tip-status-guardbreak tip-recommendation-status"><span>Guard-break</span><img class="tip-status-icon" src="img/effects/Poptext_guard_break.webp" alt="" aria-hidden="true"></span>')
		.replace(/\bArmor piercing\b/gi, 'Armor piercing')
		.replace(/\bCorpse removal\b/gi, '<span class="tip-status tip-status-corpse-removal"><span>Corpse removal</span></span>');

	return `<span class="tip-recommendation-status">${recommendationText}</span>`;
}

function formatEnemyText(text) {
	return String(text || '')
		.replace(/(Bone Bearer)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Bearer']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Bearer.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Soldiers?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Soldier']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/Bone_Militia.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
		.replace(/(Bone Captains?)([,.]?)/gi, (_, name, punctuation) => `<a class="enemy-name enemy-tooltip tip-marked tip-marked--enemy" href="${enemyWikiLinks['Bone Captain']}" target="_blank" rel="noopener noreferrer" style="--enemy-tooltip-image: url('img/enemies/BoneCaptainAttack1.webp')"><span class="tip-marked-text">${name}</span><span class="tip-marked-icon" aria-hidden="true"></span></a>${punctuation}`)
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
		${groupIndex < groups.length - 1 ? '<div class="provision-priority-arrow">↑</div>' : ''}
	`).join('');
}

function renderRegionTips(tips) {
	if (tips && typeof tips === 'object' && !Array.isArray(tips)) {
		const renderGroupItem = item => {
			if (item && typeof item === 'object' && !Array.isArray(item)) {
				const label = String(item.label || '');
				const notes = Array.isArray(item.notes) ? item.notes : [];
				return `
					<li class="tip-group-item-parent">
						${formatFullTipText(label)}
						${notes.length ? `<ul class="tip-danger-sublist">${notes.map(note => `<li>${formatFullTipText(String(note || ''))}</li>`).join('')}</ul>` : ''}
					</li>
				`;
			}
			return `<li>${formatFullTipText(item)}</li>`;
		};

		const renderGroup = (title, items, extraClass = '') => {
			if (!Array.isArray(items) || !items.length) {
				return '';
			}

			return `
			<div class="tip-group${extraClass ? ' ' + extraClass : ''}">
				<strong>${title}</strong>
				<ul>
					${items.map(renderGroupItem).join('')}
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
			if (item && typeof item === 'object' && !Array.isArray(item)) {
				const label = String(item.label || '');
				const notes = Array.isArray(item.notes) ? item.notes : [];
				return `
					<li class="tip-danger-parent">
						${formatFullTipText(label)}
						${notes.length ? `<ul class="tip-danger-sublist">${notes.map(note => `<li>${formatFullTipText(String(note || ''))}</li>`).join('')}</ul>` : ''}
					</li>
				`;
			}
			const text = String(item || '');
			const stressMatch = text.match(/^(Stress)\s+from\s+(.+?)(\s+enemies?)?$/i);
			if (!stressMatch) {
				return `<li>${formatFullTipText(text)}</li>`;
			}
			if (stressRendered) {
				return '';
			}
			stressRendered = true;

			return `
				<li class="tip-danger-parent">
					<span class="tip-danger-stress"><span class="tip-danger-stress-label">${escapeHtml(stressMatch[1])}</span><img class="tip-danger-stress-icon" src="img/effects/stress.webp" alt="" aria-hidden="true"></span> from ${stressTargets.map(target => formatFullTipText(target)).join(' / ')}
				</li>
			`;
		};

		return `
			<div class="tip-triple">
				${renderGroup('Enemy types:', tips.enemyTypes)}
				${renderGroup('Effective DMG:', tips.effective)}
				${renderGroup('Ineffective DMG:', tips.ineffective)}
			</div>
			<div class="tip-layout-grid">
				<div class="tip-layout-left">
				${renderGroup('Resistances to increase:', tips.resistances, 'tip-group--resistances')}
				<hr class="tip-divider">
				${renderGroup('Recommendations:', tips.recommendations, 'tip-group--recommendations')}
				</div>
				<div class="tip-group tip-group--dangers">
					<strong>Dangers:</strong>
					<ul>
						${dangerItems.map(renderDangerItem).join('')}
					</ul>
				</div>
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
setupTooltipPositioning();
