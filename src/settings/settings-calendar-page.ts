import type { CalendarConfig, CalendarGranularity, CalendarSection } from "../contracts/config.types";
import { type App, Setting } from "obsidian";
import { FolderSuggestion } from "./ui/folder-suggestion";
import { SettingsWidget } from "./settings-widget";
import { capitalize } from "../utils";
import { SECTIONS_MAP } from "../constants";

export class SettingsCalendarPage extends SettingsWidget {
  constructor(
    app: App,
    private containerEl: HTMLElement,
    private config: CalendarConfig,
  ) {
    super(app);
  }

  get headingText(): string {
    return `Configuring ${this.config.name}`;
  }

  display(): void {
    const { containerEl } = this;

    const heading = new Setting(containerEl)
      .setName(this.headingText)
      .setHeading()
      .addButton((button) => {
        button
          .setClass("journal-clickable")
          .setIcon("chevron-left")
          .setTooltip("Back to list")
          .onClick(() => {
            this.navigate({ type: "home" });
          });
      });

    const badge = heading.nameEl.createEl("span");
    badge.innerText = `ID: ${this.config.id}`;
    badge.classList.add("flair");

    new Setting(containerEl).setName("Journal name").addText((text) => {
      text.setValue(this.config.name).onChange(() => {
        this.config.name = text.getValue();
        heading.setName(this.headingText);
        this.save();
      });
    });

    new Setting(containerEl)
      .setName("Root folder")
      .setDesc("All other folders in sections will be relative to this one")
      .addText((text) => {
        new FolderSuggestion(this.app, text.inputEl);
        text
          .setValue(this.config.rootFolder)
          .setPlaceholder("Example: folder 1/folder 2")
          .onChange(() => {
            this.config.rootFolder = text.getValue();
            this.save();
          });
      });
    const startUp = new Setting(containerEl)
      .setName("Open on startup")
      .setDesc("Open a note whenever you open this vault?")
      .addToggle((toggle) => {
        toggle.setValue(this.config.openOnStartup).onChange(() => {
          this.config.openOnStartup = toggle.getValue();
          this.save(true);
        });
      });
    if (this.config.openOnStartup) {
      startUp.addDropdown((dropdown) => {
        const available: CalendarGranularity[] = [];
        if (this.config.day.enabled) {
          dropdown.addOption("day", "Daily note");
          available.push("day");
        }
        if (this.config.week.enabled) {
          dropdown.addOption("week", "Weekly note");
          available.push("week");
        }
        if (this.config.month.enabled) {
          dropdown.addOption("month", "Monthly note");
          available.push("month");
        }
        if (this.config.quarter.enabled) {
          dropdown.addOption("quarter", "Quarterly note");
          available.push("quarter");
        }
        if (this.config.year.enabled) {
          dropdown.addOption("year", "Yearly note");
          available.push("year");
        }
        if (!available.contains(this.config.startupSection)) {
          this.config.startupSection = available[0];
          this.save();
        }
        dropdown.setValue(this.config.startupSection).onChange((value) => {
          this.config.startupSection = value as CalendarConfig["startupSection"];
          this.save();
        });
      });
    }

    this.renderSectionsHeading("day", this.config.day);
    this.renderSectionsHeading("week", this.config.week);
    this.renderSectionsHeading("month", this.config.month);
    this.renderSectionsHeading("quarter", this.config.quarter);
    this.renderSectionsHeading("year", this.config.year);
  }

  renderSectionsHeading(sectionName: CalendarGranularity, config: CalendarSection): void {
    const setting = new Setting(this.containerEl).setName(`${capitalize(SECTIONS_MAP[sectionName])} notes`);
    if (config.enabled) {
      setting.addButton((button) => {
        button
          .setIcon("cog")
          .setClass("journal-clickable")
          .setTooltip(`Configure ${SECTIONS_MAP[sectionName]} notes`)
          .onClick(() => {
            this.navigate({
              type: "journal",
              id: this.config.id,
              section: sectionName,
            });
          });
      });
    }
    setting.addToggle((toggle) => {
      toggle.setValue(config.enabled).onChange((value) => {
        config.enabled = value;
        this.save(true);
      });
    });
  }
}
