export type IAuction = {
    id: number;
    title: string;
    description: string;
    fileId: number;
    initialPrice: number;
    actualBidPrice: number;
    startBidDate: string;
    endBidDate: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    tagId: number;
    sellerId: number;
    buyerId: number | null;
    stateId: number;
};
