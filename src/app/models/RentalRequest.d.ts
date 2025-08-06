export interface RentalRequest {
    productId: number;
    startDate: string; // format YYYY-MM-DD
    endDate: string;
    quantity: number;
}
