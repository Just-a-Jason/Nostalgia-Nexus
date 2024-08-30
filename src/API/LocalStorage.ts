export default abstract class LocalStorage {
  public static tryGet(defaultValue: boolean, key: string): boolean {
    const data = localStorage.getItem(key);

    if (localStorage.getItem(key) === null) {
      LocalStorage.set(key, defaultValue);
      return defaultValue;
    }

    return JSON.parse(data!) as boolean;
  }

  public static set(key: string, value: boolean) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
