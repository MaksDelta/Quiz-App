import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Question } from '../interfaces/question';
import { Result } from '../interfaces/result';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  @Output() finalResult = new EventEmitter();
  @Output() showMenuScreen = new EventEmitter();

  public questions: Array<any>;
  public selected = {} as Question;
  public result = {} as Result;

  public timeElapsed: number;
  private timerSubscription!: Subscription;

  public questionsLimit: number;
  public difficulty: string;

  public index: number;
  public answer: string;

  constructor() {
    this.questions = [];
    this.timeElapsed = 0; 
    this.reset();
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
    this.stopTimer(); // Stop the timer when the quiz is finished

    this.result.total = this.questions.length;
    this.result.correctPercentage =
      (this.result.correct / this.result.total) * 100;
    this.result.wrongPercentage = (this.result.wrong / this.result.total) * 100;

    this.finalResult.emit(this.result);
  }

  nextQuestion(): void {
    if (this.answer == '') return;
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
    });
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