export type INotification = {
    id: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    userId: number;
    auctionId: number | null;
    messageId: number | null;
};
