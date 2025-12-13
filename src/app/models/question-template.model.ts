/**
 * Modèle pour les templates de questions dynamiques
 * Permet de générer des questions avec des valeurs aléatoires
 */

export interface QuestionTemplate {
  id: string;
  chapterId: string;
  type: 'multiple_choice' | 'free_input' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Variables aléatoires à générer
  variables?: QuestionVariable[];
  
  // Template de la question avec placeholders {var1}, {var2}, etc.
  questionTemplate: string;
  
  // Pour QCM : template des réponses avec formules
  answersTemplate?: AnswerTemplate[];
  
  // Pour saisie libre : formule pour calculer la réponse correcte
  correctAnswerFormula?: string;
  
  // Template de l'explication
  explanationTemplate?: string;
  
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
   */
  static generateQuestion(template: QuestionTemplate): any {
    // Génère les valeurs aléatoires
    const variables = this.generateVariables(template.variables || []);
    
    // Remplace les placeholders dans la question
    const question = this.replacePlaceholders(template.questionTemplate, variables);
    
    // Génère la réponse selon le type
    let result: any = {
      id: template.id,
      chapterId: template.chapterId,
      type: template.type,
      difficulty: template.difficulty,
      question: question,
      tags: template.tags || []
    };
    
    if (template.type === 'multiple_choice' && template.answersTemplate) {
      result.answers = this.generateAnswers(template.answersTemplate, variables);
    } else if (template.type === 'free_input' && template.correctAnswerFormula) {
      result.correctAnswer = this.evaluateFormula(template.correctAnswerFormula, variables).toString();
    }
    
    if (template.explanationTemplate) {
      result.explanation = this.replacePlaceholders(template.explanationTemplate, variables);
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
   */
  private static generateAnswers(templates: AnswerTemplate[], variables: Record<string, number>): any[] {
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
      return this.generateAnswers(templates, modifiedVariables);
    }
    
    return uniqueAnswers;
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
