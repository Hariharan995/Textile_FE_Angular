export class NotificationMessage {
    message!: string;
    type!: string;
}

export enum NotificationType {
    success = "success",
    warning = "warning",
    error = "error",
    info = "info",
}
