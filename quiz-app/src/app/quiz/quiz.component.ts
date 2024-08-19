import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Question } from '../interfaces/question';
import { Result } from '../interfaces/result';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  @Output() finalResult = new EventEmitter();
  @Output() showMenuScreen = new EventEmitter();
  @Input() questions: Array<any> = [];
  @Input() difficulty: string = '';
  @Input() questionsLimit: number = 0;

  public selected = {} as Question;
  public result = {} as Result;

  public timeElapsed: number = 0;
  public minutes: number = 0;
  public seconds: number = 0;
  private timerSubscription!: Subscription;

  public index: number = 0;
  public answer: string = '';

  constructor() {}

  ngOnInit(): void {
    this.reset();
    this.showQuestion(0);
  }

  showQuestion(index: number): void {
    this.selected = this.questions[index];

    if (index === 0 && !this.timerSubscription) {
      this.startTimer();
    }
  }

  showMyMainMenu(): void {
    this.showMenuScreen.emit(true);
    this.stopTimer();
  }

  finishQuiz() {
    this.stopTimer();

    this.result.total = this.questions.length;
    this.result.correctPercentage =
      (this.result.correct / this.result.total) * 100;
    this.result.wrongPercentage = (this.result.wrong / this.result.total) * 100;

    this.finalResult.emit({
      result: this.result,
      difficulty: this.difficulty,
      questionsLimit: this.questionsLimit,
      timeElapsed: this.timeElapsed,
    });
  }

  nextQuestion(): void {
    if (this.answer === '') return;
    this.checkAnswer();
    this.index++;
    if (this.questions.length > this.index) {
      this.answer = '';
      this.showQuestion(this.index);
    } else {
      this.finishQuiz();
    }
  }

  checkAnswer() {
    let isAnswer = this.questions[this.index].correct_answers[this.answer];
    isAnswer === 'true' ? this.result.correct++ : this.result.wrong++;
  }

  startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeElapsed++;
      this.minutes = Math.floor(this.timeElapsed / 60);
      this.seconds = this.timeElapsed % 60;
    });
  }

  timeConvert(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft}`;
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  reset(): void {
    this.answer = '';
    this.index = 0;
    this.timeElapsed = 0;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.result = {
      total: 0,
      correct: 0,
      wrong: 0,
      correctPercentage: 0,
      wrongPercentage: 0,
    };
  }
}
