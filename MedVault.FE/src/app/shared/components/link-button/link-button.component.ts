import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-button',
  imports: [CommonModule],
  templateUrl: './link-button.component.html',
  styleUrl: './link-button.component.scss'
})
export class LinkButtonComponent {
  @Input() label: string = '';
  @Input() textColor: string = '#00f'; // default blue
  @Input() isDisabled: boolean = false;

  @Output() buttonClickEvent = new EventEmitter<void>();

  onClick() {
    if (!this.isDisabled) {
      this.buttonClickEvent.emit();
    }
  }
}
