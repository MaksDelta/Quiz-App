import { Component } from '@angular/core';
import { QuizService } from './services/quiz.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public questionsLimit: number;
  public difficulty: string;
  private difficulties: string[] = ['Easy', 'Medium', 'Hard'];
  private questionsLimits: number[] = [5, 10, 15, 20];

  public showMainMenu: boolean;
  public showQuizScreen: boolean;
  public showResultScreen: boolean;

  test: any;
  public finalResultData: any;

  public loading: boolean;

  constructor(private quizService: QuizService) {
    this.questionsLimit = 10;
    this.difficulty = 'Easy';
    this.showMainMenu = true;
  }

  quizQuestions(isRandom = false): void {
    if (isRandom) {
      this.random();
    }
    this.toggleLoading();
    this.quizService
      .getQuizQuestions(this.difficulty, this.questionsLimit)
      .subscribe((response) => {
        this.test = response;
        this.showMainMenu = false;
        this.showQuizScreen = true;
        this.toggleLoading();
      });
  }

  finalResult(result: any): void {
    this.finalResultData = result;
    this.showQuizScreen = false;
    this.showResultScreen = true;
  }

  showMainMenuScreen(event: any): void {
    this.showQuizScreen = false;
    this.showResultScreen = false;
    this.showMainMenu = true;
  }

  random() {
    const randomDifficultyLimit = Math.floor(
      Math.random() * this.questionsLimits.length
    );
    this.questionsLimit = this.questionsLimits[randomDifficultyLimit];
    const randomDifficultyIndex = Math.floor(
      Math.random() * this.difficulties.length
    );
    this.difficulty = this.difficulties[randomDifficultyIndex];
  }

  toggleLoading() {
    this.loading = !this.loading;
  }
}
