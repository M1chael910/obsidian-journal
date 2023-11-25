import { CalendarJournal } from "../calendar-journal/calendar-journal";
import { MomentDate } from "../contracts/date.types";
import { CodeBlockNav } from "./code-block-nav";

export class CodeBlockNavQuarter extends CodeBlockNav {
  constructor(containerEl: HTMLElement, journal: CalendarJournal, date: string) {
    super(containerEl, journal, date);
    this.granularity = "quarter";
  }

  isCurrentEnabled(): boolean {
    return this.journal.config.quarterly.enabled;
  }
  openDate(date: string): void {
    this.journal.quarterly.open(date);
  }

  renderOne(parent: HTMLElement, date: MomentDate, clickable = true) {
    const monthWrapper = parent.createDiv({
      cls: "journal-nav-quarter-wrapper",
    });
    monthWrapper.createDiv({
      cls: "journal-nav-quarter",
      text: date.format("[Q]Q"),
    });
    if (clickable && this.journal.config.monthly.enabled) {
      monthWrapper.dataset.date = date.format("YYYY-MM-DD");
      monthWrapper.classList.add("journal-clickable");
      monthWrapper.on("click", ".journal-nav-quarter-wrapper", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.quarterly.open(date);
        }
      });
    }
    monthWrapper.createDiv({
      cls: "journal-nav-relative",
      text: this.relativeQuarter(date),
    });

    this.renderYear(parent, date);
  }

  relativeQuarter(date: MomentDate) {
    const thisQuarter = this.journal.today.startOf(this.granularity);
    const fromNow = date.diff(thisQuarter, "quarter");
    if (fromNow === 0) {
      return "This quarter";
    } else if (fromNow === -1) {
      return "Last quarter";
    } else if (fromNow === 1) {
      return "Next quarter";
    }
    if (fromNow < 0) {
      return `${Math.abs(fromNow)} quarter ago`;
    }
    return `${fromNow} quarter from now`;
  }
}
