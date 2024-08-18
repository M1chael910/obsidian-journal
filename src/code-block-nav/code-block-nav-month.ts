import { CalendarJournal } from "../calendar-journal/calendar-journal";
import type { MomentDate } from "../contracts/date.types";
import { CodeBlockNav } from "./code-block-nav";

export class CodeBlockNavMonth extends CodeBlockNav {
  constructor(containerEl: HTMLElement, journal: CalendarJournal, date: string, addLinks = true) {
    super(containerEl, journal, date, addLinks);
    this.granularity = "month";
  }

  isCurrentEnabled(): boolean {
    return this.journal.config.month.enabled;
  }
  openDate(date: string): void {
    this.journal.month.open(date);
  }

  renderOne(parent: HTMLElement, date: MomentDate, clickable = true) {
    const monthWrapper = parent.createDiv({
      cls: "journal-nav-month-wrapper",
    });
    monthWrapper.createDiv({
      cls: "journal-nav-month",
      text: date.format("MMMM"),
    });
    if (this.addLinks && clickable && this.journal.config.month.enabled) {
      monthWrapper.dataset.date = date.format("YYYY-MM-DD");
      monthWrapper.classList.add("journal-clickable");
      monthWrapper.on("click", ".journal-nav-month-wrapper", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.month.open(date);
        }
      });
    }
    monthWrapper.createDiv({
      cls: "journal-nav-relative",
      text: this.relativeMonth(date),
    });

    this.renderYear(parent, date);
  }

  relativeMonth(date: MomentDate) {
    const thisMonth = this.journal.today.startOf("month");
    const fromNow = date.diff(thisMonth, "month");
    if (fromNow === 0) {
      return "This month";
    } else if (fromNow === -1) {
      return "Last month";
    } else if (fromNow === 1) {
      return "Next month";
    }
    if (fromNow < 0) {
      return `${Math.abs(fromNow)} months ago`;
    }
    return `${fromNow} months from now`;
  }
}
