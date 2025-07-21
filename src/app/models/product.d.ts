type Product = {
    id : number,
    imageName?: string;
    name : string,
    code : string,
    category: Category;
    description : string,
    etat?: Etat,
    isOccasion?: boolean;
    price: number;       // Prix de location
    available: boolean;  // Disponible à la location
}
