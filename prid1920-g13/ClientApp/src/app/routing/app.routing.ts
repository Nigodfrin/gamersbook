import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { LoginComponent } from '../components/login/login.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Role } from '../models/User';
import { SignUpComponent } from '../components/signup/signup.component';
import {PostListComponent} from '../components/postlist/postlist.component';
import {ReadQuestion} from '../components/readquestion/readquestion.component';
import { CreateQuestionComponent } from '../components/createquestion/createquestion.component';
import {TagListComponent} from '../components/taglist/taglist.component';
import { AuthGuardAuthor } from '../services/authAuthor.guard';



const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'postlist',
    component: PostListComponent
  },
  {
    path: 'postlist/:name',
    component: PostListComponent,
    
  },
  {
    path: 'readquestion/:id',
    component: ReadQuestion,
  },
  {
    path: 'createquestion',
    component: CreateQuestionComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Admin,Role.Member]}
  },
  {
    path: 'createquestion/:id',
    component: CreateQuestionComponent,
    canActivate: [AuthGuardAuthor],
    data: {roles: [Role.Admin]}
  },
  {
    path: 'taglist',
    component: TagListComponent,

  }
  ,
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];
export const AppRoutes = RouterModule.forRoot(appRoutes);