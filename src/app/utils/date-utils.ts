/**
 * Convertit un objet Date JavaScript en une chaîne de caractères
 * au format "YYYY-MM-DD", en conservant la date locale (sans décalage UTC).
 *
 * Cette méthode permet d'éviter les erreurs de fuseau horaire lors de
 * l'envoi de dates vers un backend Java (ex : LocalDate),
 * qui attend une date sans heure ni fuseau.
 *
 * Exemple :
 *   new Date("2025-08-05") → "2025-08-04T22:00:00.000Z" (UTC)
 *   Résultat attendu : "2025-08-05" (date locale réelle)
 */
export function toLocalDateString(date: Date): string {
    // Ajuste l'heure en soustrayant le décalage de fuseau horaire (en minutes)
    // pour recentrer la date sur la zone locale de l'utilisateur
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

    // Convertit au format ISO (YYYY-MM-DDTHH:mm:ssZ) et extrait uniquement la partie date
    return local.toISOString().split('T')[0];
}

/**
 * Transforme une chaîne "YYYY-MM-DD" en Date à minuit (00:00) dans le fuseau local.
 * Contrairement à `new Date(string)` qui interprète en UTC.
 */
export function parseLocalDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // mois = 0-indexé
}
