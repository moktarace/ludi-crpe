import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathNotation'
})
export class MathNotationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    
    let result = value;
    
    // Supprimer les chevrons et accolades restants
    result = result.replace(/[<>{}]/g, '');
    
    // Remplacer les notations de programmation par des notations mathématiques
    
    // sqrt() → √
    result = result.replace(/sqrt\(([^)]+)\)/g, '√($1)');
    
    // Simplifier les racines avec parenthèses redondantes
    result = result.replace(/√\((\d+)\)/g, '√$1');
    
    // pow(a, 2) → a²
    result = result.replace(/pow\(([^,]+),\s*2\)/g, '($1)²');
    result = result.replace(/pow\(([^,]+),\s*3\)/g, '($1)³');
    
    // Notation ^ pour les puissances : a^2 → a², a^3 → a³, a^n → aⁿ
    
    // Point d'interrogation en exposant : a^? → a?
    result = result.replace(/(\d+|\w)\^\?/g, '$1ˀ');
    
    // Exposants à plusieurs chiffres
    result = result.replace(/(\d+|\w)\^(\d+)/g, (match, base, exp) => {
      const superscripts: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
      };
      const superExp = exp.split('').map((d: string) => superscripts[d] || d).join('');
      return `${base}${superExp}`;
    });
    
    // Pour les exposants avec variables ou expressions
    result = result.replace(/(\d+|\w)\^([a-z])/g, '$1^$2');
    result = result.replace(/(\d+|\w)\^\(([^)]+)\)/g, '$1^($2)');
    
    // Simplifier les puissances de nombres simples
    result = result.replace(/\((\d+)\)²/g, '$1²');
    result = result.replace(/\((\d+)\)³/g, '$1³');
    
    // round() → arrondi
    result = result.replace(/round\(([^)]+)\)/g, 'arrondi($1)');
    
    // Fractions : a / b → a/b (avec meilleur affichage)
    // Détecter les divisions simples et les convertir
    result = result.replace(/\(([^)]+)\)\s*\/\s*\(([^)]+)\)/g, '($1)/($2)');
    result = result.replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2');
    
    // floor() → partie entière
    result = result.replace(/floor\(([^)]+)\)/g, 'E($1)');
    
    // ceil() → partie entière supérieure  
    result = result.replace(/ceil\(([^)]+)\)/g, 'plafond($1)');
    
    // abs() → valeur absolue
    result = result.replace(/abs\(([^)]+)\)/g, '|$1|');
    
    // Nettoyer les parenthèses inutiles dans les racines
    result = result.replace(/√\(([a-zA-Z])\)/g, '√$1');
    
    return result;
  }
}
