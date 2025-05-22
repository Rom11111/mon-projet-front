import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-file-chooser',
    imports: [FormsModule, MatIcon],
  templateUrl: './file-chooser.component.html',
  styleUrl: './file-chooser.component.scss'
})
export class FileChooserComponent {

    file? : File

    @Output()
    selected = new EventEmitter<File | null>()

    onFileSelected(e: any) {
        this.file = e.target.files[0];
        this.selected.emit(this.file)
    }
}
