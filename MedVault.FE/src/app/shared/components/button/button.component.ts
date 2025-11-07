import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { isImageIcon } from '../../../utils/validators';
import { ButtonVariant } from '../../../utils/constants';

@Component({
  selector: 'app-button',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
ButtonVariant = ButtonVariant;
  @Input() label: string;
  @Input() icon: string;
  @Input() variant = ButtonVariant.Filled;
  @Input() backgroundColor: string = '#2d61ac';
  @Input() textColor: string = '#ffffff';
  @Input() disabled = false;
  @Output() buttonClickEvent = new EventEmitter<Event>();
  @Input() customClass: string;

  get isImageIconUsed(): boolean {
    return isImageIcon(this.icon);
  }

  get customStyles() {
    const styles: { [key: string]: string } = {};
    if (this.variant === 'filled') {
      styles['background-color'] = this.backgroundColor;
    } else {
      styles['background-color'] = '#ffffff';
    }
    styles['color'] = this.textColor;
    if (this.variant === 'outlined' || this.variant === 'outlined-sm') {
      styles['border'] = `1px solid ${this.textColor}`;
    }
    return styles;
  }

  handleClick(event: Event) {
    this.buttonClickEvent.emit(event);
  }
}
