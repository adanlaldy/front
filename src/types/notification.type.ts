export type INotification = {
    id: number;
    content: string;
    is_read: boolean;
    created_at: string;
    user_id: number;
    auction_id: number | null;
    message_id: number | null;
};
