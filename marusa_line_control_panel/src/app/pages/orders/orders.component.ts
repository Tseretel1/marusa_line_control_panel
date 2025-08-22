import { Component, OnInit } from '@angular/core';
import { GetPost } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { PhotoAlbumComponent } from "../../shared/components/photo-album/photo-album.component";


@Component({
  selector: 'app-orders',
  imports: [CommonModule, PhotoAlbumComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
    ngOnInit(): void {
      this.generateRandomOrders();
    }
 RandomPost: GetPost = {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    description: "High-quality over-ear headphones with noise cancellation and 20 hours battery life.",
    price: 120,
    discountedPrice: 99,
    productType: "Electronics",
    photoUrl: "https://example.com/photos/headphones-main.jpg",
    photoId: 101,
    postId: 1,
    likeCount: 57,
    quantity: 25,
    photos: [
      {
        id: 1,
        photoId: 101,
        photoUrl: "https://www.solidsmack.com/wp-content/uploads/2019/06/epoxy-resin-chessset-00.jpg",
        postId: 1
      },
      {
        id: 2,
        photoId: 102,
        photoUrl: "https://www.solidsmack.com/wp-content/uploads/2019/06/epoxy-resin-chessset-00.jpg",
        postId: 1
      }
    ]
  };

  RandomUser: GetUser = {
    id: 101,
    name: "John",
    lastName: "Doe",
    phoneNumber: "+1 555-123-4567",
    location: "New York, USA",
    photo: "https://example.com/photos/users/john-doe.jpg"
  };

  RandomOrdersObject: OrderList = {
    orders: [],
    totalOrders: 0,
    confirmedOrders: 0
  };

  generateRandomOrders() {
    const statuses = ["Pending", "Confirmed", "Shipped", "Delivered"];
    this.RandomOrdersObject.orders = Array.from({ length: 6 }, (_, i) => {
      const status = statuses[i % statuses.length];
      const confirmed = status === "Confirmed";

      return {
        id: i + 1,
        orderCreateDate: new Date(),
        post: this.RandomPost,
        user: this.RandomUser,
        orderStatus: status,
        orderConfirmed: confirmed,
        orderComment: confirmed
          ? "Order confirmed successfully."
          : "Waiting for confirmation."
      };
    });

    this.RandomOrdersObject.totalOrders = this.RandomOrdersObject.orders.length;
    this.RandomOrdersObject.confirmedOrders = this.RandomOrdersObject.orders.filter(
      o => o.orderConfirmed
    ).length;
    console.log(this.RandomOrdersObject);
  }

}export interface GetUser {
  id: number;
  name: string;
  lastName: string;
  phoneNumber: string;
  location: string;
  photo: string;
}

export interface GetOrder {
  id: number;
  post: GetPost;
  user: GetUser;
  orderStatus: string;
  orderConfirmed: boolean;
  orderComment: string;
  orderCreateDate:Date;
}

export interface OrderList {
  orders: GetOrder[];
  totalOrders: number;
  confirmedOrders: number;
}
