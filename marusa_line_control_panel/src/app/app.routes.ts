import { Routes } from '@angular/router';
import { PostsComponent } from './pages/posts/posts.component';
import { EditPostComponent } from './pages/edit-post/edit-post.component';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details.component';
import { UsersComponent } from './pages/users/users.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path:'posts', component: PostsComponent},
    { path:'add-posts', component: AddPostComponent},
    { path:'edit-posts/:id', component: EditPostComponent},
    { path:'order-details/:id', component: OrderDetailsComponent},
    { path:'orders', component: OrdersComponent},
    { path:'users', component: UsersComponent},
    { path:'dashboard', component: DashboardComponent},
    { path: '', component: PostsComponent }, 
    { path: '**', component: PostsComponent }  
];
