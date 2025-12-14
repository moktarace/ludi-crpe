import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markdownFormat'
})
export class MarkdownFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    
    let result = value;
    
    // **texte** → <strong>texte</strong> (gras)
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // *texte* → <em>texte</em> (italique)
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // _texte_ → <em>texte</em> (italique alternatif)
    result = result.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // __texte__ → <strong>texte</strong> (gras alternatif)
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Remplacer les sauts de ligne \n par <br>
    result = result.replace(/\n/g, '<br>');
    
    return result;
  }
}
