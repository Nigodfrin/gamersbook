import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { AppRoutes } from '../routing/app.routing';
import { AppComponent } from '../components/app/app.component';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { NavMenuComponent } from '../components/nav-menu/nav-menu.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { SharedModule } from './shared.module';
import { EditUserComponent } from '../components/edit-user/edit-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SetFocusDirective } from '../directives/setfocus.directive';
import { SignUpComponent } from '../components/signup/signup.component';
import { TagListComponent} from '../components/taglist/taglist.component'
import { PostListComponent } from '../components/postlist/postlist.component';
import {ReadQuestion} from '../components/readquestion/readquestion.component';
import { MarkdownModule } from 'ngx-markdown';
import { SimplemdeModule } from 'ngx-simplemde';
import { EditCommentComponent } from '../components/edit-comment/edit-comment.component';
import { CreateQuestionComponent } from '../components/createquestion/createquestion.component';
import { EditTagComponent } from '../components/edit-tag/edit-tag.component';
import { CommentComponent } from '../components/comment-component/comment.component';
import { ProfileComponent, DialogCropper } from '../components/profile-component/profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchGamesComponent } from '../components/searchGames/searchGames.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    EditTagComponent,
    LoginComponent,
    UserListComponent,
    UnknownComponent,
    RestrictedComponent,
    SetFocusDirective,
    SignUpComponent,
    EditUserComponent,
    PostListComponent,
    ReadQuestion,
    EditCommentComponent,
    CreateQuestionComponent,
    TagListComponent,
    CommentComponent,
    ProfileComponent,
    DialogCropper,
    SearchGamesComponent
    
  ],
  entryComponents: [EditUserComponent,EditCommentComponent,EditTagComponent,DialogCropper],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    SimplemdeModule.forRoot({}),
    ImageCropperModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }