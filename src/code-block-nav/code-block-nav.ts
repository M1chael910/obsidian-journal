import { MarkdownRenderChild, getIcon } from "obsidian";
import type { MomentDate } from "../contracts/date.types";
import type { CalendarGranularity } from "../contracts/config.types";
import { CalendarJournal } from "../calendar-journal/calendar-journal";

export abstract class CodeBlockNav extends MarkdownRenderChild {
  granularity: CalendarGranularity = "day";

  constructor(
    containerEl: HTMLElement,
    protected journal: CalendarJournal,
    protected date: string,
    protected addLinks = true,
  ) {
    super(containerEl);
  }

  display() {
    this.containerEl.empty();

    const date = this.journal.date(this.date).startOf(this.granularity);

    const view = this.containerEl.createDiv({
      cls: "journal-nav-view",
    });

    const prevDate = date.clone().subtract(1, this.granularity);
    const prevBlock = view.createDiv({
      cls: `journal-${this.granularity}-nav journal-nav-prev`,
    });
    this.renderOne(prevBlock, prevDate, true);

    const current = view.createDiv({
      cls: `journal-${this.granularity}-nav journal-nav-current`,
    });
    this.renderOne(current, date, false);

    const iconPrev = current.createDiv({
      cls: "journal-nav-icon journal-nav-icon-prev",
    });
    const iconPrevEl = getIcon("arrow-left");
    if (iconPrevEl) iconPrev.appendChild(iconPrevEl);

    const iconNext = current.createDiv({
      cls: "journal-nav-icon journal-nav-icon-next",
    });
    const iconNextEl = getIcon("arrow-right");
    if (iconNextEl) iconNext.appendChild(iconNextEl);

    const nextDate = date.clone().add(1, this.granularity);
    const nextBlock = view.createDiv({
      cls: `journal-${this.granularity}-nav journal-nav-next`,
    });
    this.renderOne(nextBlock, nextDate, true);

    if (this.addLinks && this.isCurrentEnabled()) {
      iconPrev.classList.add("journal-clickable");
      iconPrev.dataset.date = prevDate.format("YYYY-MM-DD");
      iconNext.classList.add("journal-clickable");
      iconNext.dataset.date = nextDate.format("YYYY-MM-DD");

      iconPrev.on("click", ".journal-nav-icon-prev", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.openDate(date);
        }
      });
      iconNext.on("click", ".journal-nav-icon-next", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.openDate(date);
        }
      });
    }

    if (this.addLinks && this.journal.config.day.enabled) {
      const today = this.journal.today;
      if (!today.isSame(date)) {
        const todayBlock = view.createDiv({
          cls: `journal-nav-today`,
          text: "Today",
        });
        todayBlock.classList.add("journal-clickable");
        todayBlock.dataset.date = today.format("YYYY-MM-DD");
        todayBlock.on("click", ".journal-nav-today", (e) => {
          const date = (e.currentTarget as HTMLElement)?.dataset?.date;
          if (date) {
            this.journal.day.open(date);
          }
        });
      }
    }
  }

  abstract renderOne(parent: HTMLElement, date: MomentDate, clickable: boolean): void;
  abstract isCurrentEnabled(): boolean;
  abstract openDate(date: string): void;

  renderWeek(parent: HTMLElement, date: MomentDate, clickable = true) {
    const week = parent.createDiv({
      cls: "journal-nav-week",
      text: date.format("[W]w"),
    });
    if (this.addLinks && clickable && this.journal.config.week.enabled) {
      week.classList.add("journal-clickable");
      week.dataset.date = date.format("YYYY-MM-DD");
      week.on("click", ".journal-nav-week", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.week.open(date);
        }
      });
    }
    return week;
  }

  renderMonth(parent: HTMLElement, date: MomentDate) {
    const month = parent.createDiv({
      cls: "journal-nav-month",
      text: date.format("MMMM"),
    });
    if (this.addLinks && this.journal.config.month.enabled) {
      month.classList.add("journal-clickable");
      month.dataset.date = date.format("YYYY-MM");
      month.on("click", ".journal-nav-month", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.month.open(date);
        }
      });
    }
    return month;
  }

  renderYear(parent: HTMLElement, date: MomentDate) {
    const year = parent.createDiv({
      cls: "journal-nav-year",
      text: date.format("YYYY"),
    });
    if (this.addLinks && this.journal.config.year.enabled) {
      year.classList.add("journal-clickable");
      year.dataset.date = date.format("YYYY");
      year.on("click", ".journal-nav-year", (e) => {
        const date = (e.currentTarget as HTMLElement)?.dataset?.date;
        if (date) {
          this.journal.year.open(date);
        }
      });
    }
    return year;
  }
}
