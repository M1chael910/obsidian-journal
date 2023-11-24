export type CalendarGranularity = "day" | "week" | "month" | "quarter" | "year";
export type SectionName = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface PluginSettings {
  journals: Record<string, JournalConfig>;
  defaultId: string;
  calendar: {
    firstDayOfWeek: number;
    firstWeekOfYear: number;
  };
}

interface JournalCaseConfig {
  id: string;
  name: string;
}

export interface CalendarConfig extends JournalCaseConfig {
  type: "calendar";

  rootFolder: string;
  openOnStartup: boolean;
  startupSection: SectionName;

  daily: CalendarSection;
  weekly: CalendarSection;
  monthly: CalendarSection;
  quarterly: CalendarSection;
  yearly: CalendarSection;
}

export interface CalendarSection {
  enabled: boolean;
  openMode: "active" | "tab" | "split" | "window";
  titleTemplate: string;
  dateFormat: string;
  folder: string;
  template: string;
  ribbon: {
    show: boolean;
    icon: string;
    tooltip: string;
  };
  createOnStartup: boolean;
}

export interface IntervalConfig extends JournalCaseConfig {
  type: "interval";
}

export type JournalConfig = CalendarConfig | IntervalConfig;

export interface CalerndatFrontMatter {
  type: "calendar";
  id: string;
  start_date: string;
  end_date: string;
  granularity: CalendarGranularity;
}
export type JournalFrontMatter = CalerndatFrontMatter;
