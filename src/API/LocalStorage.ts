type SettingsKey =
  | "allow-cache"
  | "animated-background"
  | "run-after-download"
  | "create-shortcut"
  | "ui-animations";

export default abstract class LocalStorage {
  public static tryGet(defaultValue: boolean, key: SettingsKey): boolean {
    const data = localStorage.getItem(key);

    if (localStorage.getItem(key) === null) {
      LocalStorage.set(key, defaultValue);
      return defaultValue;
    }

    return JSON.parse(data!) as boolean;
  }

  public static set(key: SettingsKey, value: boolean) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
