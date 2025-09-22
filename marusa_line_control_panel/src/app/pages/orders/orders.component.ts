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
    productTypeId: 1,
    photoUrl: "https://example.com/photos/headphones-main.jpg",
    photoId: 101,
    postId: 1,
    likeCount: 57,
    quantity: 25,
    photos: [
      {
        id: 1,
        photoId: 101,
        photoUrl: "https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/532018856_17853764127507299_7763299281408285407_n.jpg?stp=dst-jpegr_s600x600_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7EpVcaMUvKMQ7kNvwEnvo4i&_nc_oc=Adk4lRBQbS1Hj3B5Wfki8zs6s9uKgdLlrOqUndsIGYVu8x_ycXgM0Fx5CkOe88YuHiM&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=XeFKtfHCgKgGtECIXzaZwQ&oh=00_AfWJMLjnao8-ubGq-SJszWCePMP0j6N16VN2V5dWh7EbHg&oe=68A918E1",
        postId: 1
      },
      {
        id: 2,
        photoId: 102,
        photoUrl: "https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/524396955_17851591905507299_3175430878758152086_n.jpg?stp=dst-jpegr_s600x600_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=gJ54qIeVbQsQ7kNvwEc5bls&_nc_oc=Adnf9AVmjCJw1mpqkhlDIia-YlV8ZSgF1uxMMdiEnXhjNfwd37Hs7oqvfUG0NWX8Ncg&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=uHjOrDPNS5fWQmJHodGSvQ&oh=00_AfVsuKSbCF6PiyhJqsgMPgKWljLoQGiS5cKuq6fiAWpcqA&oe=68A92AE4",
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
