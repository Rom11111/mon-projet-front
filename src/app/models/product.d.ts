type Product = {
    id : number,
    name : string,
    code : string,
    category: Category;
    description : string,
    etat?: Etat,
    isOccasion?: boolean;
    rentalPrice: number; // Prix de location
    available: boolean;  // Disponible à la location
}
