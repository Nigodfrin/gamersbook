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
    path: 'postlist/readquestion/:id',
    component: ReadQuestion,

  }
  ,
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];
export const AppRoutes = RouterModule.forRoot(appRoutes);