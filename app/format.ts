/** "2025-09-30" -> "30 september" */
export const convertDate = (date_string: string) => {
	const date = new Date(date_string);
	const formatter = new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" });

	const a = formatter.formatToParts(date);

	return `${a[0].value} ${a[2].value}`;
};

/** "HT2026" -> "hösten 2026", "VT2026" -> "våren 2026" */
export const semesterName = (semester?: string) => {
	if (!semester || !/^(HT|VT)\d{4}$/.test(semester)) {
		return "terminen";
	}
	return `${semester.startsWith("HT") ? "hösten" : "våren"} ${semester.slice(2)}`;
};

/** "HT2026" -> "HT26" */
export const semesterShort = (semester?: string) =>
	semester && /^(HT|VT)\d{4}$/.test(semester)
		? semester.slice(0, 2) + semester.slice(4)
		: "terminen";

/** "HT2026" -> "i höst", "VT2026" -> "i vår" */
export const thisSemester = (semester?: string) =>
	semester?.startsWith("VT") ? "i vår" : "i höst";

/**
 * Parses a duration as serialized by Django, either ISO 8601
 * ("P0DT00H00M05.863673S") or str(timedelta) ("1 day, 0:00:05.863673").
 * Returns seconds, or null if it can't be parsed.
 */
export const parseDuration = (d: string | null | undefined) => {
	if (!d) {
		return null;
	}

	const iso = d.match(
		/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?)?$/
	);
	if (iso) {
		const [, days, h, m, s] = iso;
		return (
			Number(days ?? 0) * 86400 +
			Number(h ?? 0) * 3600 +
			Number(m ?? 0) * 60 +
			Number(s ?? 0)
		);
	}

	const py = d.match(/^(?:(\d+) days?, )?(\d+):(\d{2}):([\d.]+)$/);
	if (py) {
		const [, days, h, m, s] = py;
		return (
			Number(days ?? 0) * 86400 +
			Number(h) * 3600 +
			Number(m) * 60 +
			Number(s)
		);
	}

	return null;
};

const WEEKDAYS = [
	"måndag",
	"tisdag",
	"onsdag",
	"torsdag",
	"fredag",
	"lördag",
	"söndag"
];

export const weekdayName = (i: number) => WEEKDAYS[i] ?? "";
export const weekdayShort = (i: number) =>
	(WEEKDAYS[i] ?? "").slice(0, 3).replace(/^./, (c) => c.toUpperCase());
