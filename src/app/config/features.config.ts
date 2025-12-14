/**
 * Configuration des fonctionnalités de l'application
 * Permet d'activer/désactiver certaines features
 */
export const FeaturesConfig = {
  /**
   * Active le mode saisie libre (free_input)
   * Si false, toutes les questions sont affichées en mode QCM uniquement
   */
  enableFreeInputMode: false,

  /**
   * Affiche le type de question dans l'interface
   * Si false, masque l'information "QCM" ou "Saisie libre"
   */
  showQuestionType: false,

  /**
   * Affiche le niveau de difficulté des questions
   * Si false, masque l'information "easy", "medium", "hard"
   */
  showDifficulty: false,
};
