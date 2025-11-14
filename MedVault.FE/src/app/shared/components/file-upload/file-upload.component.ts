import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedMaterialModule } from '../../shared-material-module';

@Component({
  selector: 'app-file-upload',
  imports: [SharedMaterialModule, CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() label: string = "Upload File";
  @Input() allowedExtensions: string = "";  // Example ".jpg,.jpeg,.png,.pdf"

  @Output() fileSelected = new EventEmitter<File>();

  fileName: string = "";

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const validExtensions = this.allowedExtensions
      .replace(/\s/g, "")
      .split(",")
      .map(x => x.toLowerCase());

    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      event.target.value = "";
      alert(`Invalid file type. Allowed: ${this.allowedExtensions}`);
      return;
    }

    this.fileName = file.name;
    this.fileSelected.emit(file);
  }
}
