import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { HomeComponent } from './components/home/home.component';
import { KatexDirective } from './directives/katex.directive';
import { MathNotationPipe } from './pipes/math-notation.pipe';
import { ExamComponent } from './components/exam/exam.component';
import { ExamResultsComponent } from './components/exam-results/exam-results.component';
import { QuestionDisplayComponent } from './components/question-display/question-display.component';

@NgModule({
  declarations: [
    AppComponent,
    LearningPathComponent,
    QuizComponent,
    ChapterDetailComponent,
    ProgressBarComponent,
    HomeComponent,
    KatexDirective,
    MathNotationPipe,
    ExamComponent,
    ExamResultsComponent,
    QuestionDisplayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
