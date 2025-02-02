type VPArray = { videoId: string; ttl: number }[];

import { presence, strings } from "./";
const removeExpiredPrivacyOverwrites = (array: VPArray) => {
	if (!array) return [];
	return array.filter(entry => entry.ttl > Date.now());
};
let perVideoPrivacyArray: VPArray = removeExpiredPrivacyOverwrites(
		JSON.parse(localStorage.getItem("pmdEnablePrivacy"))
	),
	perVideoNonPrivacyArray: VPArray = removeExpiredPrivacyOverwrites(
		JSON.parse(localStorage.getItem("pmdDisablePrivacy"))
	);

localStorage.setItem("pmdEnablePrivacy", JSON.stringify(perVideoPrivacyArray));
localStorage.setItem(
	"pmdDisablePrivacy",
	JSON.stringify(perVideoNonPrivacyArray)
);

export function pvPrivacyUI(
	privacy: boolean,
	videoId: string,
	privacyTtl: number
): boolean {
	let perVideoPrivacy = true;
	const isVideoInArray = (videoId: string, array: VPArray) => {
		return array.some(entry => entry.videoId === videoId);
	};

	try {
		perVideoPrivacy = isVideoInArray(videoId, perVideoPrivacyArray);

		if (!document.querySelector("#pmdEnablePrivacy")) {
			const button = document.createElement("div"),
				tooltip = document.createElement("div"),
				p1 = document.createElement("p"),
				p2 = document.createElement("p"),
				parent = document.querySelector("#owner");

			button.id = "pmdEnablePrivacy";
			button.style.marginLeft = "8px";
			button.style.minWidth = "min-content";
			button.style.maxWidth = "min-content";

			button.style.backgroundImage =
				"linear-gradient(to right, #b55fd3, #18b7d2)";
			button.className =
				"yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading";
			button.addEventListener("click", () => {
				const videoId = new URLSearchParams(document.location.search).get("v"),
					ttl = Date.now() + [5, 12, 24, 168][privacyTtl] * 60 * 60 * 1000;
				if (localStorage.getItem("pmdPrivacyEnabled") === "true") {
					isVideoInArray(videoId, perVideoNonPrivacyArray)
						? (perVideoNonPrivacyArray = perVideoNonPrivacyArray.filter(
								e => e.videoId !== videoId
						  ))
						: perVideoNonPrivacyArray.push({ videoId, ttl });
					localStorage.setItem(
						"pmdDisablePrivacy",
						JSON.stringify(perVideoNonPrivacyArray)
					);
				} else {
					isVideoInArray(videoId, perVideoPrivacyArray)
						? (perVideoPrivacyArray = perVideoPrivacyArray.filter(
								e => e.videoId !== videoId
						  ))
						: perVideoPrivacyArray.push({ videoId, ttl });
					localStorage.setItem(
						"pmdEnablePrivacy",
						JSON.stringify(perVideoPrivacyArray)
					);
				}
			});
			p1.textContent = strings.perVideoPrivacyToolTip1;
			p2.textContent = strings.perVideoPrivacyToolTip2;
			p2.style.fontStyle = "italic";
			tooltip.id = "pmdEnablePrivacyTooltip";
			tooltip.appendChild(p1);
			tooltip.appendChild(p2);
			button.innerHTML =
				'<svg id="pmdPrivacyEnabled" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="21" width="23" viewBox="0 0 640 512" style="display: inline-block;"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path></svg><svg id="pmdPrivacyDisabled" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="21" width="23" viewBox="0 0 576 512" style="display: none;"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>';
			parent.appendChild(button);
			parent.appendChild(tooltip);
			tooltip.style.opacity = "0";
			tooltip.style.position = "absolute";
			tooltip.style.padding = "5px";
			tooltip.style.borderRadius = "5px";
			tooltip.style.top = "-5px";
			tooltip.style.zIndex = "1";
			tooltip.style.transition = "opacity 0.3s ease-in-out";
			tooltip.style.color = "#fff";
			tooltip.style.background = "#2c2f33";
			tooltip.style.transitionDelay = "700ms";

			button.addEventListener("mouseover", function () {
				tooltip.style.opacity = "1";
				tooltip.style.top = `${button.offsetTop - tooltip.offsetHeight - 5}px`;
				tooltip.style.left = `${
					button.offsetLeft + button.offsetWidth / 2 - tooltip.offsetWidth / 2
				}px`;
				tooltip.style.transitionDelay = "50ms";
			});
			button.addEventListener("mouseleave", function () {
				tooltip.style.opacity = "0";
				setTimeout(() => {
					tooltip.style.transitionDelay = "700ms";
				});
			});
		} else {
			if (privacy) {
				perVideoPrivacy = !isVideoInArray(videoId, perVideoNonPrivacyArray);
				localStorage.setItem("pmdPrivacyEnabled", "true");
			} else {
				perVideoPrivacy = isVideoInArray(videoId, perVideoPrivacyArray);
				localStorage.setItem("pmdPrivacyEnabled", "false");
			}

			const svgEnabled =
					document.querySelector<HTMLElement>("#pmdPrivacyEnabled"),
				svgDisabled = document.querySelector<HTMLElement>(
					"#pmdPrivacyDisabled"
				);
			if (perVideoPrivacy) {
				svgEnabled.style.display = "inline-block";
				svgDisabled.style.display = "none";
			} else {
				svgEnabled.style.display = "none";
				svgDisabled.style.display = "inline-block";
			}
		}
	} catch (e) {
		presence.error(
			`Something went wrong trying to place the privacy toggle button: ${e}`
		);
		return privacy;
	}

	return perVideoPrivacy;
}
