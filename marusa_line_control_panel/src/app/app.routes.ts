import { Routes } from '@angular/router';
import { PostsComponent } from './pages/posts/posts.component';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { AddPostComponent } from './pages/add-post/add-post.component';

export const routes: Routes = [
    { path:'posts', component: PostsComponent},
    { path:'add-posts', component: AddPostComponent},
    { path:'edit-posts/:id', component: EditPostComponent},
    { path: '', component: PostsComponent }, 
    { path: '**', component: PostsComponent }  
];
