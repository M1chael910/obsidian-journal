export type OpenMode = "active" | "tab" | "split" | "window";

export interface PluginSettings {
  version: number;

  showReloadHint: boolean;

  journals: Record<string, JournalSettings>;
  shelves: Record<string, ShelfSettings>;

  calendar: {
    firstDayOfWeek: number;
    firstWeekOfYear: number;
  };

  calendarView: {
    display: "month" | "week" | "day";

    leaf: "left" | "right";
    weeks: "none" | "left" | "right";

    todayMode: "navigate" | "create";
  };
}

export interface ShelfSettings {
  id: string;
  name: string;
}

export interface WriteDaily {
  type: "day";
}

export interface WriteWeekly {
  type: "week";
}

export interface WriteMonthly {
  type: "month";
}

export interface WriteQuarterly {
  type: "quarter";
}

export interface WriteYearly {
  type: "year";
}

export interface WriteWeekdays {
  type: "weekdays";
  weekdays: number[];
}

export interface WriteCustom {
  type: "custom";
  every: "day" | "week" | "month" | "quarter" | "year";
  duration: number;
}

export interface EndWritingNever {
  type: "never";
}

export interface EndWritingDate {
  type: "date";
  date: string;
}

export interface EndWritingAfterNTimes {
  type: "repeats";
  repeats: number;
}

export type FixedWriteIntervals = WriteDaily | WriteWeekly | WriteMonthly | WriteQuarterly | WriteYearly;

export interface JournalSettings {
  id: string;
  name: string;
  shelves: string[];

  write: FixedWriteIntervals | WriteWeekdays | WriteCustom;

  openMode: OpenMode;
  confirmCreation: boolean;

  nameTemplate: string;
  dateFormat: string;
  folder: string;
  templates: string[];

  start: string;

  end: EndWritingNever | EndWritingDate | EndWritingAfterNTimes;

  index: {
    enabled: boolean;
    anchorDate: string;
    anchorIndex: number;
    allowBefore: boolean;
    type: "increment" | "reset_after";
    resetAfter: number;
    secondary: boolean;
    secondaryAncorIndex: number;
  };

  autoCreate: boolean;

  commands: JournalCommand[];

  highlights: JournalHighlight[];

  navBlock: {
    type: "create" | "existing";
    nameTemplate: string;
    showPeriod: boolean;
    periodTemplate: string;
  };
}

export interface JournalCommand {
  icon: string;
  name: string;
  type:
    | "same"
    | "next"
    | "previous"
    | "same_next_week"
    | "same_previous_week"
    | "same_next_month"
    | "same_previous_month"
    | "same_next_year"
    | "same_previous_year";
  context: "today" | "open_note" | "only_open_note";
  showInRibbon: boolean;
}

interface JournalHighlight {
  condition: JournalHighlightCondition;
  highlights: JournalHighlightDisplay[];
}

interface BorderSettings {
  show: boolean;
  width: number;
  color: string;
  style: string;
}

type JournalHighlightDisplay =
  | {
      type: "background";
      color: string;
    }
  | {
      type: "border";
      left: BorderSettings;
      right: BorderSettings;
      top: BorderSettings;
      bottom: BorderSettings;
    }
  | {
      type: "shape";
      shape: "square" | "circle" | "triangle";
      color: string;
      placement_x: "left" | "center" | "right";
      placement_y: "top" | "middle" | "bottom";
    }
  | {
      type: "corner";
      placement: "top-left" | "top-right" | "bottom-left" | "bottom-right";
      color: string;
    }
  | {
      type: "icon";
      icon: string;
      placement_x: "left" | "center" | "right";
      placement_y: "top" | "middle" | "bottom";
      color: string;
    };

type JournalHighlightCondition =
  | {
      type: "title";
      condition: "contains" | "starts-with" | "ends-with";
      value: string;
    }
  | {
      type: "tag";
      condition: "contains" | "starts-with" | "ends-with";
      value: string;
    }
  | {
      type: "property";
      name: string;
      condition:
        | "exists"
        | "does-not-exist"
        | "eq"
        | "neq"
        | "contains"
        | "does-not-contain"
        | "starts-with"
        | "ends-with";
      value: string;
    }
  | {
      type: "date";
      day: number;
      month: number;
      year: number;
    }
  | {
      type: "weekday";
      weekdays: number[];
    }
  | {
      type: "offset";
      offset: number;
    }
  | {
      type: "has-note";
    }
  | {
      type: "has-open-task";
    }
  | {
      type: "all-tasks-completed";
    };

export type NotesProcessing = "keep" | "clear" | "delete";
