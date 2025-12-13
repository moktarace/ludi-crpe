import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathNotation'
})
export class MathNotationPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    
    let result = value;
    
    // Remplacer les notations de programmation par des notations mathématiques
    
    // sqrt() → √
    result = result.replace(/sqrt\(([^)]+)\)/g, '√$1');
    
    // pow(a, 2) → a²
    result = result.replace(/pow\(([^,]+),\s*2\)/g, '$1²');
    result = result.replace(/pow\(([^,]+),\s*3\)/g, '$1³');
    
    // round() → arrondi
    result = result.replace(/round\(([^)]+)\)/g, 'arrondi($1)');
    
    // floor() → partie entière
    result = result.replace(/floor\(([^)]+)\)/g, 'E($1)');
    
    // ceil() → partie entière supérieure  
    result = result.replace(/ceil\(([^)]+)\)/g, 'plafond($1)');
    
    // abs() → valeur absolue
    result = result.replace(/abs\(([^)]+)\)/g, '|$1|');
    
    // Nettoyer les notations de calcul programmation
    // Garder * pour multiplication dans les calculs numériques
    
    return result;
  }
}
