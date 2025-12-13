import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { ChapterDetailComponent } from './components/chapter-detail/chapter-detail.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ExamComponent } from './components/exam/exam.component';
import { ExamResultsComponent } from './components/exam-results/exam-results.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'learning-path', component: LearningPathComponent },
  { path: 'chapter/:id', component: ChapterDetailComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'exam', component: ExamComponent },
  { path: 'exam-results', component: ExamResultsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
