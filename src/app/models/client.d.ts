export interface Client {
    id: number;
    firstname: string;
    lastname: string;
    company: string;
    companyAddress: string;
    email: string;
    password: string;  // tu peux ne pas l'utiliser pour l'affichage, mais il est dans ton modèle
    role: 'CLIENT' | 'TECH' | 'ADMIN';  // Correspond au rôle de l'utilisateur
    photoUrl: string;  // Pour l'image de profil, tu peux l'ajouter si nécessaire
    status: 'Active' | 'Inactive';  // Statut de l'utilisateur
}
