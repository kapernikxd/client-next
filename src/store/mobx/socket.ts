// src/stores/OnlineStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import { AppState, AppStateStatus } from 'react-native';
import { connectSocket } from '../../helpers/http/socket';
import authStore from './auth';
import { MessageDTO } from '../../helpers';
import { UnreadStatus } from '../../services/chat/ChatService';

export type OnlineUser = { userId: string; isOnline: boolean };

class OnlineStore {
  onlineUsers: OnlineUser[] = [];
  socket: any = null;
  isConnected = false;
  isConnecting = false;               // NEW
  appState: AppStateStatus = AppState.currentState;

  typingUsers: { userId: string; userName: string }[] = [];
  isSubscribed = false;

  hasUserNotification = false;
  hasUserNewMessage = false;
  hasUnreadGroup = false;
  hasUnreadPrivate = false;
  hasUnreadBot = false;

  currentRoutName: string = "";

  /** комнаты, которые нужно заджойнить после коннекта/реконнекта */
  private pendingRooms = new Set<string>();    // NEW

  constructor() {
    makeAutoObservable(this);
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  setCurrentRoutName = (value: string) => {
    runInAction(() => { this.currentRoutName = value; });
  }

  handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (this.appState === 'active' && nextAppState.match(/inactive|background/)) {
      console.log('⛔ App is going to background or inactive');
      // Можно НЕ дисконнектить на iOS, но если хочешь — оставь:
      // this.disconnectSocket();
    }

    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('🚀 App is active');
      await this.connectSocket();        // дождёмся подключения
      this.flushPendingJoins();          // и восстановим комнаты
    }

    this.appState = nextAppState;
  }

  /** Промис, который резолвится после 'connect' (или если уже подключены) */
  private waitForConnect(): Promise<void> {    // NEW
    if (this.socket?.connected && this.isConnected) return Promise.resolve();
    return new Promise((resolve) => {
      const onConnect = () => {
        this.socket?.off?.('connect', onConnect);
        resolve();
      };
      this.socket?.on?.('connect', onConnect);
    });
  }

  /** Подключаемся к серверу (и умеем переподключаться) */
  async connectSocket() {
    if (this.isConnected && this.socket?.connected) return;
    if (this.isConnecting) {
      await this.waitForConnect();
      return;
    }

    const userId = authStore.getMyId();
    if (!userId) return;

    this.isConnecting = true;

    // Если сокет уже создан, но не подключён — переподключим
    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      await this.waitForConnect();
      runInAction(() => { this.isConnected = true; this.isConnecting = false; });
      this.afterConnect(userId);
      return;
    }

    // Иначе создаём сокет
    this.socket = connectSocket(userId);

    this.socket.on('connect', () => {
      runInAction(() => { this.isConnected = true; this.isConnecting = false; });
      this.afterConnect(userId);
    });

    this.socket.on('reconnect', () => {        // NEW: auto re-join
      runInAction(() => { this.isConnected = true; });
      this.afterConnect(userId);
    });

    this.socket.on('disconnect', (_reason: any) => {
      runInAction(() => {
        this.isConnected = false;
        this.onlineUsers = [];
      });
    });

    // бизнес-события
    this.registerSocketEvents();

    // дождёмся подключения, если нужно
    await this.waitForConnect().catch(() => { });
  }

  /** Действия сразу после connect/reconnect */
  private afterConnect(userId: string) {       // NEW
    this.socket?.emit?.('online', userId);
    this.flushPendingJoins();
  }

  /** отправить все отложенные joinChats */
  private flushPendingJoins() {                // NEW
    if (!this.socket?.connected || !this.pendingRooms.size) return;
    const rooms = Array.from(this.pendingRooms);
    this.socket.emit('joinChats', rooms);
    this.pendingRooms.clear();
  }

  async ensureConnectedAndJoined(chatsId: string[]) {
    if (chatsId?.length) {
      chatsId.forEach(id => this.pendingRooms.add(id));
    }
    await this.connectSocket();   // дождёмся реального 'connect'
    this.flushPendingJoins();     // сразу дожмём join
  }

  disconnectSocket() {
    const userId = authStore.getMyId();
    try {
      if (this.socket && userId) {
        this.socket.emit('offline', userId);
        this.removeSocketEvents();
        this.socket.disconnect();
      }
    } finally {
      runInAction(() => {
        this.isConnected = false;
        this.isConnecting = false;
        this.onlineUsers = [];
        this.socket = null;
      });
    }
  }

  registerSocketEvents() {
    if (!this.socket) return;
    this.socket.on('get-users', this.setOnlineUsers);
    this.socket.on("server-message:newNotification", () => this.setUserNotification(true));
    this.socket.on("server-message:newMessage", this.handleNewMessageForTab);
  }

  removeSocketEvents() {
    if (!this.socket) return;
    this.socket.off('get-users', this.setOnlineUsers);
    this.socket.off("server-message:newNotification");
    this.socket.off("server-message:newMessage");
  }

  setOnlineUsers = (users: OnlineUser[]) => {
    runInAction(() => {
      this.onlineUsers = users;
      this.typingUsers = this.typingUsers.filter(u =>
        users.some(s => s.userId === u.userId && s.isOnline)
      );
    });
  };

  setUserNotification = (value: boolean) => {
    runInAction(() => { this.hasUserNotification = value; });
  }

  setUnreadStatus = (status: UnreadStatus) => {
    runInAction(() => {
      this.hasUserNewMessage = status.hasUnread;
      this.hasUnreadGroup = status.group;
      this.hasUnreadPrivate = status.private;
      this.hasUnreadBot = status.bot;
    });
  }

  setHasUnreadGroup = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadGroup = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  setHasUnreadPrivate = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadPrivate = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  setHasUnreadBot = (value: boolean) => {
    runInAction(() => {
      this.hasUnreadBot = value;
      this.hasUserNewMessage = this.hasUnreadGroup || this.hasUnreadPrivate || this.hasUnreadBot;
    });
  }

  handleNewMessageForTab = (typeMessage: 'newPrivateMessage' | 'newGroupMessage' | 'newBotMessage') => {
    // NB: имя роута должно совпадать с навигатором
    if (this.currentRoutName === "chatMessages") {  // FIX: было "chatScreen"
      return;
    }
    runInAction(() => {
      this.hasUserNewMessage = true;
      if (typeMessage === 'newGroupMessage') this.hasUnreadGroup = true;
      if (typeMessage === 'newPrivateMessage') this.hasUnreadPrivate = true;
      if (typeMessage === 'newBotMessage') this.hasUnreadBot = true;
    });
  }

  setUserNewMessage = (value: boolean) => {
    runInAction(() => { this.hasUserNewMessage = value; });
  }

  getIsUserOnline(userId: string) {
    return this.onlineUsers.some(user => user.userId === userId);
  }

  handleTyping = (data: { userId: string; userName: string }) => {
    runInAction(() => { this.setTypingStatus(data.userId, data.userName, true); });
  };
  handleStopTyping = (userId: string) => {
    runInAction(() => { this.setTypingStatus(userId, "", false); });
  };

  setTypingStatus(userId: string, userName: string, isTyping: boolean) {
    runInAction(() => {
      if (isTyping) {
        if (!this.typingUsers.some(u => u.userId === userId)) {
          this.typingUsers.push({ userId, userName });
        }
      } else {
        this.typingUsers = this.typingUsers.filter(u => u.userId !== userId);
      }
    });
  }

  getTypingUsers() { return this.typingUsers; }

  emitTyping(chatId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit("typing", {
      room: chatId,
      userId: authStore.getMyId(),
      userName: authStore.user?.fullName,
    });
  }

  emitStopTyping(chatId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit("stop typing", {
      room: chatId,
      userId: authStore.getMyId(),
    });
  }

  emitEditedMessage(message: MessageDTO) {
    if (!this.socket?.connected) return;
    this.socket.emit('editedMessage', message);
  }

  emitWasReaded({ chatId, messageId }: { chatId: string, messageId: string }) {
    if (!this.socket?.connected) return;
    this.socket.emit("message:read", {
      chatId, messageId, senderId: authStore.getMyId(),
    });
  }

  /** Безопасный join: складываем в pending и шлём сразу, если подключены */
  emitJoinChats(chatsId: string[]) {
    if (!chatsId?.length) return;
    chatsId.forEach(id => this.pendingRooms.add(id));
    if (this.socket?.connected) {
      this.flushPendingJoins();
    }
  }
}

export default new OnlineStore();
