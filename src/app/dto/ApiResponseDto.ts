
// Réponse standard de l'API : contient toujours un message + des données
export interface ApiResponseDto<T> {
    message: string; // ex : "Produit modifié", "Erreur serveur", etc.
    data: T;         // peut être un produit, une liste, null, etc.
}
