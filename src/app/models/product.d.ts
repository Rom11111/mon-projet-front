type Product = {
    id : number,
    name : string,
    code : string,
    category: string;
    description : string,
    etat: Etat,
    labelList: Label []
    isOccasion?: boolean;
    rentalPrice: number; // Prix de location
    available: boolean;  // Disponible à la location
}
