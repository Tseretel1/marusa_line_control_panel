import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'
@Component({
  selector: 'app-add-post',
  imports: [CommonModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})
export class AddPostComponent implements OnInit{
  ngOnInit(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: false, 
    });
  }
  photos:photo [] = [];
  photoCount:number = 1;
  photoId:number = 1;
  pushPhoto(){
    if(this.photoCount <=6){
      this.photoCount++;
      this.photoId ++;
      const photo :photo = {
        id: this.photoId,
        photoUrl :'https://scontent.ftbs5-3.fna.fbcdn.net/v/t39.30808-6/514284870_122106372242929005_7493201675623268053_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0NCsZMe0-QMQ7kNvwFyujKc&_nc_oc=AdmMhKSMZZE9CDHuz2iKfVigcAduP0qdOyQ_nX5A4A41-Xa2JkLNaVvpbDmbg_7xPnY&_nc_zt=23&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=1khSihzKaKqTno0ygGTndw&oh=00_AfV7Q0k3L6Tjl8iWqk1CKM2QZTmLstegsB73Jo_IatlYqw&oe=68A8CD83',
      }
      this.photos.push(photo);
      return;
    }
    return;
  }
  removePhoto(id: number) {
    this.photos = this.photos.filter(photo => photo.id !== id);
    this.photoCount--;
  }
}

export interface photo{
  id:number;
  photoUrl:string;
}
