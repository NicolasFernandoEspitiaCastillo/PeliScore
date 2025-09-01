// --- Pesos configurables para el algoritmo de ranking ---
// Ajustar estos valores cambiará la importancia de cada factor en el puntaje final.
const WEIGHTS = {
    RATING: 0.5,        // 50% del peso viene de la calificación promedio.
    ENGAGEMENT: 0.3,    // 30% del peso viene de los likes/dislikes.
    RECENCY: 0.2,       // 20% del peso viene de qué tan reciente es la actividad.
};

/**
 * Calcula un puntaje ponderado para una pieza de contenido.
 * @param {object} content - El objeto de contenido, que debe incluir un array de sus reseñas.
 * @returns {number} El puntaje de ranking calculado.
 */
const calculateWeightedScore = (content) => {
    if (!content || !content.reviews || content.reviews.length === 0) {
        return 0; // Si no hay reseñas, el puntaje es 0.
    }

    // 1. CÁLCULO DEL PUNTAJE DE CALIFICACIÓN (Rating Score)
    const ratingScore = (content.averageRating / 10) * WEIGHTS.RATING; // Normalizado a un valor entre 0 y 0.5

    // 2. CÁLCULO DEL PUNTAJE DE INTERACCIÓN (Engagement Score)
    const totalLikes = content.reviews.reduce((sum, review) => sum + (review.likes ? review.likes.length : 0), 0);
    const totalDislikes = content.reviews.reduce((sum, review) => sum + (review.dislikes ? review.dislikes.length : 0), 0);
    const totalVotes = totalLikes + totalDislikes;
    
    // El puntaje de interacción es la proporción de likes sobre el total de votos.
    // Se multiplica por su peso. Si no hay votos, el puntaje es 0.
    const engagementScore = totalVotes > 0 ? (totalLikes / totalVotes) * WEIGHTS.ENGAGEMENT : 0;

    // 3. CÁLCULO DEL FACTOR DE RECIENCIA (Recency Factor)
    // Encuentra la fecha de la reseña más reciente.
    const mostRecentReviewDate = content.reviews.reduce((latest, review) => {
        const reviewDate = new Date(review.createdAt);
        return reviewDate > latest ? reviewDate : latest;
    }, new Date(0));

    const now = new Date();
    const daysSinceLastReview = (now.getTime() - mostRecentReviewDate.getTime()) / (1000 * 60 * 60 * 24);

    // La recencia decae logarítmicamente: más reciente = más cercano a 1.
    // El `+1` evita la división por cero y suaviza la caída.
    const recencyFactor = (1 / (daysSinceLastReview + 1)) * WEIGHTS.RECENCY;

    // --- PUNTAJE FINAL ---
    const finalScore = (ratingScore + engagementScore + recencyFactor) * 100; // Multiplicar por 100 para un número más manejable.

    // Redondear a 2 decimales.
    return Math.round(finalScore * 100) / 100;
};

module.exports = {
    calculateWeightedScore
};