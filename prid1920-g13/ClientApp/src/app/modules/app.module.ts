import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbDateNativeAdapter, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
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
import { EditCommentComponent } from '../components/edit-comment/edit-comment.component';
import { CreateQuestionComponent } from '../components/createquestion/createquestion.component';
import { EditTagComponent } from '../components/edit-tag/edit-tag.component';
import { CommentComponent } from '../components/comment-component/comment.component';
import { ProfileComponent, DialogCropper } from '../components/profile-component/profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchGamesComponent } from '../components/searchGames/searchGames.component';
import { NguCarouselModule } from '@ngu/carousel';
import { CarouselComponent } from '../components/profile-component/carousel-component/carousel.component';
import { NotifsComponent } from '../components/nav-menu/notification-component/notifications.component';
import {ToastsContainer} from '../Helpers/toast/toast-container.component';
import {FriendsComponent} from '../components/smallChat/friends.component/friends.component';
import { ChatContainerComponent } from '../components/smallChat/friends.component/chatContainer/chat-container.component';
import { CreateEventComponent } from '../components/create-event.component/create-event.component';
import { MatDatepickerModule } from '@angular/material';
import { EventListComponent } from '../components/event-list-component/event-list.component';
import { InputBadgeComponent } from '../components/event-list-component/inputBadge/input-badge-component';
import { SimplemdeModule } from 'ngx-simplemde';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { ProfileEventsCalendarComponent } from '../components/profile-component/profile-events-component/profile-events-calendar.component';
import { DatePipe } from '@angular/common';
import { NgbTimeStructAdapter } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { EventDetailsComponent } from '../components/event-details-component/event-details.component';
import { UserLineComponent } from '../components/Ui-components/user-line/user-line.component';

@NgModule({
  declarations: [
    AppComponent,
    UserLineComponent,
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
    SearchGamesComponent,
    CarouselComponent,
    NotifsComponent,
    ToastsContainer,
    FriendsComponent,
    ChatContainerComponent,
    CreateEventComponent,
    EventListComponent,
    InputBadgeComponent,
    ProfileEventsCalendarComponent,
    EventDetailsComponent,
  ],
  entryComponents: [EditUserComponent,EditCommentComponent,EditTagComponent,DialogCropper],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    FullCalendarModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutes,
    BrowserAnimationsModule,
    SharedModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    SimplemdeModule.forRoot({
      options: {
        autosave: { enabled: true, uniqueId: 'MyUniqueID' },
      },
    }),
    ImageCropperModule,
    NguCarouselModule,
    NgbModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MatDatepickerModule,
    NgbDateNativeAdapter,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }