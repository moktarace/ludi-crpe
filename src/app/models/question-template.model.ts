/**
 * Modèle pour les templates de questions dynamiques
 * Permet de générer des questions avec des valeurs aléatoires
 */

import { FeaturesConfig } from '../config/features.config';

export interface QuestionTemplate {
  id: string;
  chapterId: string;
  type: 'multiple_choice' | 'free_input' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Variables aléatoires à générer
  variables?: QuestionVariable[];
  
  // Template de la question mathématique avec placeholders {var1}, {var2}, etc.
  questionTemplate: string;
  
  // Template de la question en énoncé contextualisé (vie réelle)
  realLifeQuestionTemplate?: string;
  
  // Pour QCM : template des réponses avec formules
  answersTemplate?: AnswerTemplate[];
  
  // Pour saisie libre : formule pour calculer la réponse correcte
  correctAnswerFormula?: string;
  
  // Template de l'explication
  explanationTemplate?: string;
  
  // Template de l'explication "vie de tous les jours"
  realLifeExplanationTemplate?: string;
  
  // Templates des indices
  hintsTemplates?: string[];
  
  tags?: string[];
}

export interface QuestionVariable {
  name: string;
  min: number;
  max: number;
  step?: number; // Pas (ex: 5 pour avoir 5, 10, 15...)
  exclude?: number[]; // Valeurs à exclure (ex: [0, 1])
}

export interface AnswerTemplate {
  textFormula: string; // Formule pour calculer le texte (ex: "{a} + {b}")
  isCorrectFormula: string; // Formule booléenne (ex: "{a} * {b}")
}

/**
 * Générateur de questions à partir de templates
 */
export class QuestionGenerator {
  
  /**
   * Génère une question à partir d'un template
   * @param questionIndex L'index de la question dans la séquence (optionnel, pour déterminer le type automatiquement)
   */
  static generateQuestion(template: QuestionTemplate, questionIndex?: number): any {
    // Génère les valeurs aléatoires
    const variables = this.generateVariables(template.variables || []);
    
    // Remplace les placeholders dans la question mathématique
    const question = this.replacePlaceholders(template.questionTemplate, variables);
    
    // Remplace les placeholders dans la question contextuelle (énoncé vie réelle) si disponible
    const realLifeQuestion = template.realLifeQuestionTemplate 
      ? this.replacePlaceholders(template.realLifeQuestionTemplate, variables)
      : undefined;
    
    // Détermine le type automatiquement
    // Si enableFreeInputMode est false, toujours utiliser QCM
    let questionType = template.type;
    if (questionIndex !== undefined) {
      questionType = this.determineQuestionType(questionIndex);
    } else if (!FeaturesConfig.enableFreeInputMode && template.type === 'free_input') {
      // Forcer QCM si la saisie libre est désactivée même sans questionIndex
      questionType = 'multiple_choice';
    }
    
    // Génère la réponse selon le type
    let result: any = {
      id: template.id,
      chapterId: template.chapterId,
      type: questionType,
      difficulty: template.difficulty,
      question: question,
      realLifeQuestion: realLifeQuestion,
      tags: template.tags || []
    };
    
    // Génère les réponses pour QCM ou la réponse correcte pour saisie libre
    if (questionType === 'multiple_choice') {
      // Pour QCM, on a besoin du template d'answers
      if (template.answersTemplate) {
        result.answers = this.generateAnswers(template.answersTemplate, variables, template.difficulty);
      } else if (template.correctAnswerFormula) {
        // Si pas de template QCM mais une formule, on génère des mauvaises réponses
        result.answers = this.generateAnswersFromFormula(template.correctAnswerFormula, variables);
      }
    } else if (questionType === 'free_input') {
      // Pour saisie libre, on calcule la bonne réponse
      if (template.correctAnswerFormula) {
        result.correctAnswer = this.evaluateFormula(template.correctAnswerFormula, variables).toString();
      } else if (template.answersTemplate) {
        // Si on a un template QCM, on prend la bonne réponse
        const correctAnswerTemplate = template.answersTemplate.find(a => 
          this.evaluateFormula(a.isCorrectFormula, variables) === 1
        );
        if (correctAnswerTemplate) {
          result.correctAnswer = this.evaluateFormula(correctAnswerTemplate.textFormula, variables).toString();
        }
      }
    }
    
    if (template.explanationTemplate) {
      result.explanation = this.replacePlaceholders(template.explanationTemplate, variables);
    }
    
    if (template.realLifeExplanationTemplate) {
      result.realLifeExplanation = this.replacePlaceholders(template.realLifeExplanationTemplate, variables);
    }
    
    if (template.hintsTemplates) {
      result.hints = template.hintsTemplates.map(hint => 
        this.replacePlaceholders(hint, variables)
      );
    }
    
    return result;
  }
  
  /**
   * Génère des valeurs aléatoires pour les variables
   */
  private static generateVariables(varDefs: QuestionVariable[]): Record<string, number> {
    const variables: Record<string, number> = {};
    
    for (const varDef of varDefs) {
      let value: number;
      const step = varDef.step || 1;
      
      do {
        if (step === 1) {
          value = Math.floor(Math.random() * (varDef.max - varDef.min + 1)) + varDef.min;
        } else {
          const stepsCount = Math.floor((varDef.max - varDef.min) / step) + 1;
          const randomStep = Math.floor(Math.random() * stepsCount);
          value = varDef.min + (randomStep * step);
        }
      } while (varDef.exclude && varDef.exclude.includes(value));
      
      variables[varDef.name] = value;
    }
    
    return variables;
  }
  
  /**
   * Remplace les placeholders {var} dans un template
   */
  private static replacePlaceholders(template: string, variables: Record<string, number>): string {
    let result = template;
    
    for (const [name, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${name}\\}`, 'g');
      result = result.replace(regex, value.toString());
    }
    
    return result;
  }
  
  /**
   * Génère les réponses pour un QCM
   * Le nombre de réponses dépend de la difficulté :
   * - easy: 2 réponses (1 bonne + 1 mauvaise)
   * - medium: 3 réponses (1 bonne + 2 mauvaises)
   * - hard: 4 réponses (1 bonne + 3 mauvaises)
   */
  private static generateAnswers(templates: AnswerTemplate[], variables: Record<string, number>, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): any[] {
    const answers = templates.map(template => {
      const text = this.evaluateFormula(template.textFormula, variables).toString();
      const isCorrect = this.evaluateFormula(template.isCorrectFormula, variables) === 1;
      
      return { text, isCorrect };
    });
    
    // Détecter les doublons
    const seenTexts = new Set<string>();
    const uniqueAnswers: any[] = [];
    const correctAnswer = answers.find(a => a.isCorrect);
    
    for (const answer of answers) {
      if (!seenTexts.has(answer.text)) {
        seenTexts.add(answer.text);
        uniqueAnswers.push(answer);
      } else if (answer.isCorrect) {
        // Si la bonne réponse est en doublon, on la garde quand même
        console.warn('⚠️ Duplicate answer detected but keeping correct answer:', answer.text);
        uniqueAnswers.push(answer);
      }
    }
    
    // Si on a trop de doublons et moins de 2 réponses, régénérer avec des valeurs modifiées
    if (uniqueAnswers.length < 2) {
      console.warn('⚠️ Too many duplicate answers, regenerating...');
      // Ajouter une petite variation aux variables pour éviter les doublons
      const modifiedVariables = { ...variables };
      for (const key in modifiedVariables) {
        modifiedVariables[key] = modifiedVariables[key] + 1;
      }
      return this.generateAnswers(templates, modifiedVariables, difficulty);
    }
    
    // Limiter le nombre de réponses selon la difficulté
    const maxAnswers = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    
    // Séparer bonne et mauvaises réponses
    const correctAnswers = uniqueAnswers.filter(a => a.isCorrect);
    const wrongAnswers = uniqueAnswers.filter(a => !a.isCorrect);
    
    // Prendre 1 bonne réponse + (maxAnswers-1) mauvaises réponses
    const selectedAnswers = [
      ...correctAnswers.slice(0, 1),
      ...wrongAnswers.slice(0, maxAnswers - 1)
    ];
    
    // Mélanger pour que la bonne réponse ne soit pas toujours en premier
    return this.shuffleArray(selectedAnswers);
  }
  
  /**
   * Mélange un tableau (utilisé pour les réponses QCM)
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  /**
   * Détermine le type de question basé sur l'index
   * Progression : 2 premières en QCM, puis alternance, puis principalement saisie libre
   * Si la saisie libre est désactivée (FeaturesConfig), retourne toujours QCM
   */
  private static determineQuestionType(questionIndex: number): 'multiple_choice' | 'free_input' {
    // Si la fonctionnalité saisie libre est désactivée, toujours retourner QCM
    if (!FeaturesConfig.enableFreeInputMode) {
      return 'multiple_choice';
    }
    
    // Questions 0-1 (1-2 pour l'utilisateur) : QCM pour s'habituer
    if (questionIndex < 2) {
      return 'multiple_choice';
    }
    
    // Questions 2-4 (3-5 pour l'utilisateur) : Alternance QCM/Saisie libre
    if (questionIndex < 5) {
      return questionIndex % 2 === 0 ? 'free_input' : 'multiple_choice';
    }
    
    // Questions 5+ (6+ pour l'utilisateur) : Principalement saisie libre (80%)
    return Math.random() < 0.8 ? 'free_input' : 'multiple_choice';
  }
  
  /**
   * Génère des réponses QCM à partir d'une formule de réponse correcte
   * Crée automatiquement des distracteurs (mauvaises réponses)
   */
  private static generateAnswersFromFormula(correctFormula: string, variables: Record<string, number>): any[] {
    const correctValue = this.evaluateFormula(correctFormula, variables);
    
    const answers: any[] = [
      { text: correctValue.toString(), isCorrect: true }
    ];
    
    // Génère 3 mauvaises réponses (distracteurs)
    const wrongAnswers = new Set<number>();
    
    // Distracteur 1 : +/- quelques unités
    wrongAnswers.add(correctValue + Math.floor(Math.random() * 5) + 1);
    wrongAnswers.add(correctValue - Math.floor(Math.random() * 5) - 1);
    
    // Distracteur 2 : erreur de calcul courante (double, moitié, etc.)
    wrongAnswers.add(Math.floor(correctValue * 2));
    wrongAnswers.add(Math.floor(correctValue / 2));
    
    // Distracteur 3 : erreur d'opération
    wrongAnswers.add(Math.floor(correctValue * 1.5));
    wrongAnswers.add(Math.floor(correctValue + 10));
    
    // Garde seulement les 3 premiers distracteurs différents de la bonne réponse
    const distractors = Array.from(wrongAnswers)
      .filter(v => v !== correctValue && v > 0)
      .slice(0, 3);
    
    distractors.forEach(value => {
      answers.push({ text: value.toString(), isCorrect: false });
    });
    
    return answers;
  }
  
  /**
   * Évalue une formule mathématique
   */
  private static evaluateFormula(formula: string, variables: Record<string, number>): number {
    let expression = formula;
    
    // Remplace les variables
    for (const [name, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${name}\\}`, 'g');
      expression = expression.replace(regex, value.toString());
    }
    
    // Supporte les opérateurs de base et les fonctions mathématiques
    try {
      // Remplace les opérateurs mathématiques spéciaux
      expression = expression.replace(/\^/g, '**'); // Puissance
      
      // Ajoute le support des fonctions Math
      expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
      expression = expression.replace(/pow\(/g, 'Math.pow(');
      expression = expression.replace(/abs\(/g, 'Math.abs(');
      expression = expression.replace(/floor\(/g, 'Math.floor(');
      expression = expression.replace(/ceil\(/g, 'Math.ceil(');
      expression = expression.replace(/round\(/g, 'Math.round(');
      
      // Évalue l'expression
      return eval(expression);
    } catch (error) {
      console.error('Erreur lors de l\'évaluation de la formule:', formula, error);
      return 0;
    }
  }
}
