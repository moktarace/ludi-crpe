import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import * as katex from 'katex';

@Directive({
  selector: '[appKatex]'
})
export class KatexDirective implements OnInit, OnChanges {
  @Input() appKatex: string = '';
  @Input() displayMode: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.render();
  }

  ngOnChanges() {
    this.render();
  }

  private render() {
    if (this.appKatex) {
      try {
        katex.render(this.appKatex, this.el.nativeElement, {
          displayMode: this.displayMode,
          throwOnError: false
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        this.el.nativeElement.textContent = this.appKatex;
      }
    }
  }
}
