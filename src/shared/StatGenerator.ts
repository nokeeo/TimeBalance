import { TimeData, TimeEntry } from "./TimeStore";

interface SiteStat {
  domain: string;
  duration: number;
  entries: TimeEntry[];
}

function getDomain(url: URL) {
  const pieces = url.hostname.split(".");
  if (pieces.length > 3) {
    pieces.splice(0, 1);
    return pieces.join(".");
  }
  else if (pieces.length > 2) {
    if (pieces[pieces.length - 2].length > 3) {
      pieces.splice(0, 1);
    }

    return pieces.join(".");
  }

  return url.hostname;
}

export default class StatGenerator {
  public static getStatsForSites(data: TimeData): { [key: string]: SiteStat } {
    const sites: { [key: string]: SiteStat } = {};
    const dateKeys = Object.keys(data).sort();
    dateKeys.forEach((dateKey) => {
      const entries = data[dateKey];
      entries.forEach((entry) => {
        const domain = getDomain(new URL(entry.url));

        // Default Entry
        if (!sites[domain]) {
          sites[domain] = {
            domain,
            duration: entry.duration,
            entries: [entry],
          };
        }
        else {
          const site = sites[domain];
          site.duration += entry.duration;
          site.entries.push(entry);
          sites[domain] = site;
        }
      });
    });

    return sites;
  }
}
