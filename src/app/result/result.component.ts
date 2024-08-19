import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Result } from '../interfaces/result';
import { Question } from '../interfaces/question';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent {
  @Output() showMainMenuScreen = new EventEmitter();
  @Input() finalResult: any;

  showMainMenu() {
    this.showMainMenuScreen.emit(true);
  }

  timeConvert(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes} min ${secondsLeft} sec`;
  }
}
