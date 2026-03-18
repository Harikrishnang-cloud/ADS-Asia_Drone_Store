
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "offer" | "info" | "alert";
    createdAt: number;
}