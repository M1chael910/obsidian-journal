import type { ComputedRef } from "vue";
import type { IntervalResolver, JournalInterval } from "../types/journal.types";
import type { FixedWriteIntervals, JournalCommand } from "../types/settings.types";
import { FRONTMATTER_DATE_FORMAT } from "../constants";
import type { MomentDate } from "../types/date.types";
import { date_from_string } from "../calendar";

// TODO: write tests
export class FixedInterval implements IntervalResolver {
  #journalId: string;
  #settings: ComputedRef<FixedWriteIntervals>;

  constructor(journalId: string, settings: ComputedRef<FixedWriteIntervals>) {
    this.#journalId = journalId;
    this.#settings = settings;
  }

  resolveForDate(date: string): JournalInterval | null {
    const baseDate = date_from_string(date);
    if (!baseDate.isValid()) return null;
    return this.#buildInterval(baseDate);
  }

  resolveNext(date: string): JournalInterval | null {
    const baseDate = date_from_string(date);
    if (!baseDate.isValid()) return null;
    baseDate.add(1, this.#settings.value.type);
    return this.#buildInterval(baseDate);
  }

  resolvePrevious(date: string): JournalInterval | null {
    const baseDate = date_from_string(date);
    if (!baseDate.isValid()) return null;
    baseDate.subtract(1, this.#settings.value.type);
    return this.#buildInterval(baseDate);
  }

  resolveDateForCommand(date: string, command: JournalCommand["type"]): string | null {
    switch (command) {
      case "same":
        return date;
      case "next":
        return date_from_string(date).add(1, this.#settings.value.type).format(FRONTMATTER_DATE_FORMAT);
      case "previous":
        return date_from_string(date).subtract(1, this.#settings.value.type).format(FRONTMATTER_DATE_FORMAT);
      case "same_next_week":
        return date_from_string(date).add(1, "week").format(FRONTMATTER_DATE_FORMAT);
      case "same_previous_week":
        return date_from_string(date).subtract(1, "week").format(FRONTMATTER_DATE_FORMAT);
      case "same_next_month":
        return date_from_string(date).add(1, "month").format(FRONTMATTER_DATE_FORMAT);
      case "same_previous_month":
        return date_from_string(date).subtract(1, "month").format(FRONTMATTER_DATE_FORMAT);
      case "same_next_year":
        return date_from_string(date).add(1, "year").format(FRONTMATTER_DATE_FORMAT);
      case "same_previous_year":
        return date_from_string(date).subtract(1, "year").format(FRONTMATTER_DATE_FORMAT);
    }
    return null;
  }

  countRepeats(startDate: string, endDate: string): number {
    const start = date_from_string(startDate);
    const end = date_from_string(endDate);
    return Math.ceil(start.diff(end, this.#settings.value.type));
  }

  #buildInterval(base: MomentDate): JournalInterval {
    const type = this.#settings.value.type;
    const start_date = base.startOf(type).format(FRONTMATTER_DATE_FORMAT);
    const end_date = base.endOf(type).format(FRONTMATTER_DATE_FORMAT);
    return {
      key: `${this.#journalId}_${start_date}_${end_date}`,
      start_date,
      end_date,
    };
  }
}
