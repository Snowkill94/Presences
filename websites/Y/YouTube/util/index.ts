export const presence = new Presence({
	clientId: "463097721130188830",
});

let cachedTime = 0;
export function adjustTimeError(time: number, acceptableError: number): number {
	if (Math.abs(time - cachedTime) > acceptableError) cachedTime = time;
	return cachedTime;
}

export function truncateAfter(str: string, pattern: string): string {
	return str.slice(0, str.indexOf(pattern));
}

export interface Resolver {
	isActive(): boolean;
	getTitle(): string;
	getUploader(): string;
	getChannelURL(): string;
}

const stringMap = {
	play: "general.playing",
	pause: "general.paused",
	live: "general.live",
	ad: "youtube.ad",
	search: "general.searchFor",
	browsingTypeVideos: "youtube.browsingTypeVideos",
	browseShorts: "youtube.browsingShorts",
	browsingVid: "youtube.browsingVideos",
	browsingPlayl: "youtube.browsingPlaylists",
	viewCPost: "youtube.viewingCommunityPost",
	ofChannel: "youtube.ofChannel",
	readChannel: "youtube.readingChannel",
	searchChannel: "youtube.searchChannel",
	trending: "youtube.trending",
	browsingThrough: "youtube.browsingThrough",
	subscriptions: "youtube.subscriptions",
	library: "youtube.library",
	history: "youtube.history",
	purchases: "youtube.purchases",
	reports: "youtube.reportHistory",
	upload: "youtube.upload",
	viewChannel: "general.viewChannel",
	viewAllPlayL: "youtube.viewAllPlaylist",
	viewEvent: "youtube.viewLiveEvents",
	viewLiveDash: "youtube.viewLiveDashboard",
	viewAudio: "youtube.viewAudioLibrary",
	studioVid: "youtube.studio.viewContent",
	studioEdit: "youtube.studio.editVideo",
	studioAnaly: "youtube.studio.videoAnalytics",
	studioComments: "youtube.studio.videoComments",
	studioTranslate: "youtube.studio.videoTranslations",
	studioTheir: "youtube.studio.viewTheir",
	studioCAnaly: "youtube.studio.channelAnalytics",
	studioCComments: "youtube.studio.channelComments",
	studioCTranslate: "youtube.studio.channelTranslations",
	studioArtist: "youtube.studio.artistPage",
	studioDash: "youtube.studio.dashboard",
	viewPlaylist: "general.viewPlaylist",
	readAbout: "general.readingAbout",
	viewAccount: "general.viewAccount",
	viewHome: "general.viewHome",
	watchVid: "general.watchingVid",
	watchLive: "general.watchingLive",
	browsing: "general.browsing",
	searchSomething: "general.searchSomething",
	watchStreamButton: "general.buttonWatchStream",
	watchVideoButton: "general.buttonWatchVideo",
	viewChannelButton: "general.buttonViewChannel",
	videos: "youtube.videos",
	perVideoPrivacyToolTip1: "youtube.perVideoPrivacy.tooltip.1",
	perVideoPrivacyToolTip2: "youtube.perVideoPrivacy.tooltip.2",
};

export let strings: Awaited<
	ReturnType<typeof presence.getStrings<typeof stringMap>>
> = null;

let oldLang: string = null,
	currentTargetLang: string = null,
	fetchingStrings = false,
	stringFetchTimeout: number = null;

function fetchStrings() {
	if (oldLang === currentTargetLang && strings) return;
	if (fetchingStrings) return;
	const targetLang = currentTargetLang;
	fetchingStrings = true;
	stringFetchTimeout = setTimeout(() => {
		presence.error(`Failed to fetch strings for ${targetLang}.`);
		fetchingStrings = false;
	}, 5e3);
	presence.info(`Fetching strings for ${targetLang}.`);
	presence
		.getStrings(stringMap, targetLang)
		.then(result => {
			if (targetLang !== currentTargetLang) return;
			clearTimeout(stringFetchTimeout);
			strings = result;
			fetchingStrings = false;
			oldLang = targetLang;
			presence.info(`Fetched strings for ${targetLang}.`);
		})
		.catch(() => null);
}

setInterval(fetchStrings, 3000);
fetchStrings();

/**
 * Sets the current language to fetch strings for and returns whether any strings are loaded.
 */
export function checkStringLanguage(lang: string): boolean {
	currentTargetLang = lang;
	return !!strings;
}

const settingsFetchStatus: Record<string, number> = {},
	cachedSettings: Record<string, unknown> = {};

function startSettingGetter(setting: string) {
	if (!settingsFetchStatus[setting]) {
		let success = false;
		settingsFetchStatus[setting] = setTimeout(() => {
			if (!success)
				presence.error(`Failed to fetch setting '${setting}' in time.`);
			delete settingsFetchStatus[setting];
		}, 2000);
		presence
			.getSetting(setting)
			.then(result => {
				cachedSettings[setting] = result;
				success = true;
			})
			.catch(() => null);
	}
}

export function getSetting<E extends string | boolean | number>(
	setting: string,
	fallback: E = null
): E {
	startSettingGetter(setting);
	return (cachedSettings[setting] as E) ?? fallback;
}
