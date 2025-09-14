import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_shown";

class OnboardingStore {
  isShown = false;
  loading = true;

  constructor() {
    makeAutoObservable(this);
    this.check();
  }

  async check() {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      runInAction(() => {
        this.isShown = value === "true";
        this.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load onboarding state", e);
    }
  }

  async complete() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      runInAction(() => {
        this.isShown = true;
      });
    } catch (e) {
      console.error("Failed to save onboarding state", e);
    }
  }
}

export default new OnboardingStore();
