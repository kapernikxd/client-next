import { eventStore, profile, ui, auth, notifications, chat, OnlineStore, pollStore, specialistStore, settingsStore, onboardingStore, botStore, aiBotStore } from './mobx';

class RootStore {
    eventStore;
    profileStore;
    uiStore;
    authStore;
    notificationsStore;
    chatStore;
    onlineStore;
    pollStore;
    specialistStore;
    settingsStore;
    onboardingStore;
    botStore;
    aiBotStore;

constructor() {
    this.eventStore = eventStore;
    this.profileStore = profile;
    this.uiStore = ui;
    this.authStore = auth;
    this.notificationsStore = notifications;
    this.chatStore = chat;
    this.onlineStore = OnlineStore;
    this.pollStore = pollStore;
    this.specialistStore = specialistStore;
    this.settingsStore = settingsStore;
    this.onboardingStore = onboardingStore;
    this.botStore = botStore;
    this.aiBotStore = aiBotStore;
  }
}

export const rootStore = new RootStore();
