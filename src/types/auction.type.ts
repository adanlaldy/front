export type IAuction = {
    id: number;
    title: string;
    description: string;
    file_id: number;
    initial_price: number;
    actual_bid_price: number;
    start_bid_date: string;
    end_bid_date: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    tag_id: number;
    seller_id: number;
    buyer_id: number | null;
    state_id: number;
};
