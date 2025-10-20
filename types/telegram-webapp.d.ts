declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: WebAppInitData
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: ThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  BackButton: BackButton
  MainButton: MainButton
  HapticFeedback: HapticFeedback

  ready(): void
  expand(): void
  close(): void
  enableClosingConfirmation(): void
  disableClosingConfirmation(): void
  onEvent(eventType: string, eventHandler: () => void): void
  offEvent(eventType: string, eventHandler: () => void): void
  sendData(data: string): void
  openLink(url: string, options?: { try_instant_view?: boolean }): void
  openTelegramLink(url: string): void
  showPopup(params: PopupParams, callback?: (button_id: string) => void): void
  showAlert(message: string, callback?: () => void): void
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void
}

export interface WebAppInitData {
  query_id?: string
  user?: WebAppUser
  receiver?: WebAppUser
  chat?: WebAppChat
  chat_type?: string
  chat_instance?: string
  start_param?: string
  can_send_after?: number
  auth_date: number
  hash: string
}

export interface WebAppUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface WebAppChat {
  id: number
  type: "group" | "supergroup" | "channel"
  title: string
  username?: string
  photo_url?: string
}

export interface ThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
}

export interface BackButton {
  isVisible: boolean
  show(): void
  hide(): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

export interface MainButton {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: boolean
  setText(text: string): void
  show(): void
  hide(): void
  enable(): void
  disable(): void
  showProgress(leaveActive?: boolean): void
  hideProgress(): void
  onClick(callback: () => void): void
  offClick(callback: () => void): void
}

export interface HapticFeedback {
  impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void
  notificationOccurred(type: "error" | "success" | "warning"): void
  selectionChanged(): void
}

export interface PopupParams {
  title?: string
  message: string
  buttons?: PopupButton[]
}

export interface PopupButton {
  id?: string
  type?: "default" | "ok" | "close" | "cancel" | "destructive"
  text?: string
}
