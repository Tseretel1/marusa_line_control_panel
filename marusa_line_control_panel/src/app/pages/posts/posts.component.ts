import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoAlbumComponent } from '../../shared/components/photo-album/photo-album.component';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
@Component({
  selector: 'app-posts',
  imports: [CommonModule,PhotoAlbumComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{
  gallery: GalleryPhotos[] = [];
  cards: Posts[] = [];

  likeCount:number = 0;
  viewCount:number = 0;
  ngOnInit(): void {
    this.generateCards(25);
    this.cards.forEach(element=>{
      this.likeCount = this.likeCount + element.likeCount;
      this.viewCount = this.viewCount + element.viewCount;
    })
  }

   private generateCards(count: number): Posts[] {
    const randomCards: Posts[] = [];

    const epoxyProducts = [
      'დომინო',
    ];

    const sampleDescriptions = [
      'დომინო ახალ ფერებში🤍💙 მზადდება სასურველ ფერში✨ შესაკვეთად მომწერე💌 #დომინო #Domino #BoardGames #TableGames #თამაშები #სათამაშოები #GameNight #თამაშისდღეა🚀'
    ];
    this.gallery=[
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t39.30808-6/516546333_122106372320929005_1161079155029642186_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=AX_F8FX1QWgQ7kNvwFm4FMJ&_nc_oc=AdnYTJNTFLSU8cOFxoE3mAb5NgmWlb8ne9Ob4ePUACmZOht_qeUJytnMN1L3euWVOnI&_nc_zt=23&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=2H8IA9HhXyVcGo6qpszjjA&oh=00_AfV48eAKhiJvFQ9Q6UZZUMQB8MKccaAOcJ2eIlSkxt8HOg&oe=68A8C8BC"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t39.30808-6/514266778_122106372326929005_3134060519176099028_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=NXn0KiUYVHAQ7kNvwEph6Fm&_nc_oc=AdkJ7SbFxOgIvvDejGu2HuPMzBn524uVHTUBcpAJrWHpiysvP9kiw14rX4OlHs2E2dQ&_nc_zt=23&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=msSHW9ZLqin10NFwgN8svg&oh=00_AfUgsndvJ-8YJBX-m7-HWCw6LWorTZUoqORijma5ctNFWQ&oe=68A8BA6F"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t39.30808-6/514284870_122106372242929005_7493201675623268053_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0NCsZMe0-QMQ7kNvwFyujKc&_nc_oc=AdmMhKSMZZE9CDHuz2iKfVigcAduP0qdOyQ_nX5A4A41-Xa2JkLNaVvpbDmbg_7xPnY&_nc_zt=23&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=1khSihzKaKqTno0ygGTndw&oh=00_AfV7Q0k3L6Tjl8iWqk1CKM2QZTmLstegsB73Jo_IatlYqw&oe=68A8CD83"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/532018856_17853764127507299_7763299281408285407_n.jpg?stp=dst-jpegr_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7EpVcaMUvKMQ7kNvwHW7Ctn&_nc_oc=Adn85oLN9QoTgk5wU2nZ8NntcF-AExOOSvND8uIY-gPke9oNR7abw3N1XnA4s84E0QY&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=kDL3gr9XWHVMY1gHjJSH-A&oh=00_AfVVp2beHikbbSJlOhYpzoqkx05SE_z_zPdK9p5opW90FA&oe=68A8A861"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/531242836_17853764157507299_3132523549915783297_n.jpg?stp=dst-jpegr_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=bTV_Y93arLQQ7kNvwHd7D8I&_nc_oc=AdlRC5q0fD_diQQFQgbxRXP4kFhgecVPu62N260TZ1lr7KK2FefBttGX8UdisqO0HRY&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=rwuwE1zpO8gTOEo4xJ80DQ&oh=00_AfXROA6gZgSlqdOVfI-HvbfNTU4NAHRlyx5Mu38doccs5A&oe=68A8B16C"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/530844717_17853764166507299_1783251566218199950_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=X8KGu3diAR4Q7kNvwEIsXJy&_nc_oc=Adlhj5gKxQA6zSxSVHcUnE1GJX1uvZpDmA9mVAg0tPNekQQW-fsNKOKrQebIRWCoHNY&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=ydO03oyCQ2D8ai0ghFeR_w&oh=00_AfWT1wn7VbNksQajrH2V5QJKV3gBH4DW3KtpkWGEUjFf5Q&oe=68A8BE6B"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/530955797_17853633156507299_5527989941632050932_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Xl7SbNdL8EsQ7kNvwG8Dwcs&_nc_oc=AdmFl2_UyJXe_GJGaW5gxjaOFhBk4GdpAlExf7Y4O9Nc42jbUOW5AL1gk9uyWH8AdQc&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=vTP_dLck0o4fbezQy_e_AA&oh=00_AfV3Uf4ViZJk2nV9QRADwUrRLFcgGObRCQm-mN_KxgroEg&oe=68A8ADE6"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/530827332_17853633174507299_2834120596005339059_n.jpg?stp=dst-jpegr_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=rtnMxiSQw4wQ7kNvwHi-8y1&_nc_oc=AdnhrKjSuD_hzVG8y7Z4zMnGt1nDQ1UE6bfuPxBWM7ikXpQ3ONCniDe8885gzOFAxU8&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=OFIrQgbj4MwRhldUAEIZww&oh=00_AfUYeDeNefBaHRWAGrUfSZTANKOXiVYabMsqCS41T61IpQ&oe=68A8ABA8"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t39.30808-6/528587984_122123484998929005_6460052787600204705_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=wzcNBnvyw-sQ7kNvwEfqdxw&_nc_oc=AdmAo46zy7iQFcjhENEAedlLjK2H0sknY6IZwSVBDNHpUnigGkUKlXN_Wb1DamGscQY&_nc_zt=23&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=tkLkauhnlx3HYqlydRKMUg&oh=00_AfW8VE8DTbQD_cC8d4IUMvAala0DjU71o5leMaCZV8k7RQ&oe=68A8B67D"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/529770539_17853221400507299_4730395214342415118_n.jpg?stp=dst-jpegr_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=EGtj0VRqol0Q7kNvwEizusA&_nc_oc=AdkNsOrWuREjiy4Jly7fSHi_CIBzt8hzHH3Xu8fROC8XRXrERuLHJ93RDm4SyTQ1tYE&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=7PI49AOpMXjsuL7POH8cpw&oh=00_AfWkPe5r1ojuDUEeBwWallZn0y7h4VoDnQW3YRmw4dX1Hg&oe=68A8CB40"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/527981863_17852843490507299_1056978041547559357_n.jpg?stp=dst-jpegr_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=wM_f-wf6fAMQ7kNvwGcrkCK&_nc_oc=AdkUt0VaMiVruJekGRcDimiJH3zPnxZDSNQQ2ETSPY2_moGYd568p7BkGSoRCaGzays&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=Om4TrMLy28wyCSMq8p8kWA&oh=00_AfWONzWmHqVIEc09iM8UkzDZe1k--NAc26H4qE2TnJ1nBw&oe=68A8BCD2"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/528776268_17852843508507299_4345150763450656527_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=YhPmfZVjjkYQ7kNvwHuCDTc&_nc_oc=AdnhIF-VZ1hP8F37v6ZRN20dTYvskb19HdAgYP7WptjTfiEkELudluwyKmc1txJ0nAI&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=X1U_TjnOJtGyNK0QEjRh-g&oh=00_AfWH-4zeYRtisF7gcpaFXcXLcVFw1THxPVRIuswqqR5kmA&oe=68A8CBB8"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/527574346_17852647794507299_1721173399501607257_n.jpg?stp=dst-jpegr_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=6nq7-qBQZ-0Q7kNvwHzmNuA&_nc_oc=AdmQx_Erw4iV-wct99ZdVu7LSPygRV2oLa6PAHh7grdmGM01sjbYbRD_KGl5xb6mf8E&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=5H5MNYyA2H7yV22iGCfmTg&oh=00_AfUUwGvtAU3fyu1PZPIepikyTTkZZ3vMELpI8QjtG5SBUQ&oe=68A8B170"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/527436801_17852647764507299_998619509876407868_n.jpg?stp=dst-jpegr_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_ohc=yOGziXxyvpoQ7kNvwGqT95K&_nc_oc=Admsm9fCOlTd11dwAUBTeLYrB-vVzEr8pKz_yDnKe5xjflyoHMX9mGV4GkEmLXFyqpM&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=zQEgRG5E9H-8cqXTim8Tfw&oh=00_AfVaEkbULd4q72fXTPLsGDzvO1kT9XiRQDmrmFhI9KmBOA&oe=68A8AD77"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/527609032_17852646570507299_6021757619090538752_n.jpg?stp=dst-jpegr_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=5b638ngwzLQQ7kNvwFc08Mo&_nc_oc=AdmsjtUId5kwRpo_W7QCwjZXmrLN4aDg1YnXIMsz11EcBA6SF7P4YrTZheSYGBAIUY0&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=Y0ub4v36YK-dV1C6aFDE2w&oh=00_AfWf1QSSE99TKQKrn6TzTIIAN7op-wf9eE1Tm_P5YoZecA&oe=68A8CC37"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/527106431_17852646579507299_7276527455922242758_n.jpg?stp=dst-jpegr_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=7wL1horbSRcQ7kNvwHjUUXK&_nc_oc=Adk0xcuJDeVUVbp_bC8tHUz4cCY3PcTMP_2oKVsqz1XlNKRBxkHTrGf_UQF_snWUUz0&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=dOu_dsc-ouNGoDqLgSSu-w&oh=00_AfXT3nMbdviNXz9xTJkLzCKzQ0zZ9XpPKnU6tlxiH4ruCw&oe=68A8B993"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/527376314_17852487309507299_5365202228298499243_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hh9gtouE9aYQ7kNvwEGyKFp&_nc_oc=AdmGLCX2E9nishpHRZ0s958vXRkZthW0IENNu1kPqQUCKJu3fCDUIXOXkb2A4hvPltE&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=nX_E_Oiqr-egRApYxk2Wgg&oh=00_AfUBrQFKEA6IcIgqseZmI8GScupRPngSWXdwUbjI0hTfUg&oe=68A8A251"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/526651967_17852487375507299_6002545677824563757_n.jpg?stp=dst-jpegr_tt6&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=v8bInd-JplUQ7kNvwH-H6uJ&_nc_oc=Adn0_mpLNhc2mSThpGXuQecbQEeQObRymu6ZbNMcu-IU9ddPE-v0SqqzyZgfO2Qg4x0&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=ygx5MPVa1zIQ7Qka1y1YOA&oh=00_AfUHiIsjlzC1LX0ws-VP9nPVcXGAi7DyqEbNCIwK8QBdtw&oe=68A8A186"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/526663086_17852418708507299_7109403339830100893_n.jpg?stp=dst-jpegr_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=f2LFxlTQoLgQ7kNvwHLZSi1&_nc_oc=Admj1weYPZow1s6LJPdwz6_iGjfHd30ti5YNJavegwV8kGEgluYjt50DaxlpVJoZyqc&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=S2QAu8TIxJ_IRYVkJNL-ZA&oh=00_AfXEtbAupDf0seqVmUp-F_EeOZSc5_swcqGNrMBbfSGBhQ&oe=68A8C6F8"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/526327096_17852418630507299_4970866864663847385_n.jpg?stp=dst-jpegr_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=qFQhADn3PggQ7kNvwEjibTi&_nc_oc=Adls3hxYZsVg9fUNnLXnKWqoOgP6UsX9xmDwfAaI6Gl4tZYfwN50HqoB07UvbulFqQs&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=xJlmdvNsv4nCDjwo1gSuVw&oh=00_AfUosnI5a3OD5AlJSejn7qreuU5WPUb888fMLBhTZElxtA&oe=68A8C43A"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/523797495_17851945092507299_5797465999538820056_n.jpg?stp=dst-jpegr_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HSV3Va0Ljp8Q7kNvwEvbesl&_nc_oc=Adkx3uV-5Bd_qxlZTY_u5lwkh3eKX1ECpm0JXUjXlBeoj5PNFcQVYloWu_5m5MK7zfg&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=JP_qZ3I8J1ukReSiqZ2PrA&oh=00_AfVQXzkcJWGpSLJ5RO9yCU6Xfhp2yNmRTbcCMBImXU1Rzg&oe=68A8B339"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/524912115_17851945050507299_8677459050239950903_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dc-AlQkM_GEQ7kNvwGCKO0s&_nc_oc=Adli5QX4YFycpGxIuTH3xv_BAfP0y5c5T8CgqpGt5ux_hi72phflKtYrWjpP__HDRpI&_nc_zt=23&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=vLrvKORXG6EdNtW2VMNb5g&oh=00_AfUfY-005KlgcdLImDi6yueeq0yGVvZJ5Y-MN9rNk7IXUQ&oe=68A8CE63"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/524654373_17851945083507299_329704024311908345_n.jpg?stp=dst-jpegr_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=O-mcimXMLyYQ7kNvwFyfz1C&_nc_oc=AdkPinItwxRaoRzvAQhWZn5Bz9cC4ptOdyu6Lo-H2EvbcbBFNx0EjCOt-DHRDQv8opk&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=Uxlv53kwZfnTnqiD3Yavew&oh=00_AfX9k-O5yyVxhu-hnPrDENtvBPWPTFzak4AJsTDj0ySzyQ&oe=68A8B099"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/510410464_17851945101507299_3949871069659331448_n.jpg?stp=dst-jpegr_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=JrLSnFDikSgQ7kNvwF8wbgr&_nc_oc=Admhx4atLeevZMjIxGnhFI9RinsfbvLoLvFUifTkS-CfK0SwyKvXDTXf1EXx-kakwuA&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=0VPLvokwmLAP2C2IOcicXw&oh=00_AfVUzvoBqFrNnlgzjS57SjMYhbmiho0LSrHB8Sy_C63G6g&oe=68A8B8BB"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/523342857_17851945062507299_2664241186326475149_n.jpg?stp=dst-jpegr_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=t2Ns36IYoQcQ7kNvwFREtFP&_nc_oc=AdmzAzUzOTA_8VV-p3mv-QSvaFcgdDgnk8EWYCpZYidezrulLDOUn8BkcB0SrQRvPik&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=otYFguXcNZOpcaov0FFs_w&oh=00_AfX_7Axt3IHS9GHOA7-xRL81z5Gpqa1uMFNgqc2i15mNEQ&oe=68A8C5CF"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/524793730_17851692303507299_502582199675350138_n.jpg?stp=dst-jpegr_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=LQcCzgdDmCIQ7kNvwHQ-Sh8&_nc_oc=AdmzozmwvqZ1SNb45l2tYSPevOVJ7mVAaxv5j7oByUuMqQhrZG3DGT_W-5kmXm5tJ5I&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=5BMVbj5LxrHfBcGhWys03g&oh=00_AfX9S499EDWEaszJPJOIBBsVRFAd1tpds_GH4hGdTlEn4w&oe=68A8A76A"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/524996497_17851692312507299_7424262898893357686_n.jpg?stp=dst-jpegr_tt6&_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=jVf53-GYShUQ7kNvwHFGIRn&_nc_oc=AdlHtyH-459IMhM-oZJoXVuDz9RnN4aolZ2xqaDhEG-vdbJSm4V2mlN9M1X9pHilmmA&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=EakZrzHHqLSqCSX_OHP4Hg&oh=00_AfVDm9G29xPusi6aYS5MO1mNU2D1Ce-OPu2wu7v8lqiD4Q&oe=68A8BD01"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/523147431_17851593816507299_746372890037150398_n.jpg?stp=dst-jpegr_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=g4pN8XllupgQ7kNvwEyocoN&_nc_oc=AdmuLjz8FCdiLqbbGzqL05FmUIO-HkAl--c0PnF4Hd41UKrH-0b7ETsur6csMqmDuLg&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=qYq4xEleacnRRUT9aTXl4Q&oh=00_AfVtziojGSeOMT3wX5xoWmq4ohE2y8Au4ojwCvPVZtVhHg&oe=68A8C491"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/524048517_17851591914507299_3950270560300344465_n.jpg?stp=dst-jpegr_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=hKJUoG5gfhcQ7kNvwHtImof&_nc_oc=AdladtMeQhJJHpXZU3ZDOL2I0wPzc8Q5pGaMxdmNKQ8qvsTQUXNNmv3HhvM5qDUTZVA&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=REtdT3TqRiIXhmxua-10Vg&oh=00_AfXlpuBZUTtiOsg_mUwvEB3wg1LjEHwNFO7Oimpf0-idwg&oe=68A8D604"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/523685980_17851591896507299_64790632506693636_n.jpg?stp=dst-jpegr_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=M99YGJgHZK4Q7kNvwExTbnT&_nc_oc=AdmeWOzPhDXj2oOnBGdllBHFd2xQu_jXUgqaKP4Y4xhpBtqK1vh8cgqM_NXSaBNqz3c&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=DmxQA5bBZAVu7TzV3ZBnKA&oh=00_AfVtGpVNABlS6Z4zYp1AkX1bwuxWdZCqMmEvCS9txMrqJw&oe=68A89EE6"},
      {photo :"https://scontent.ftbs5-2.fna.fbcdn.net/v/t51.82787-15/523762604_17851591923507299_3520707132131655395_n.jpg?stp=dst-jpegr_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=--hF11fApWIQ7kNvwFhmfaJ&_nc_oc=Adm7DM1daJvKuAEmzwA7tPHHb0VKuQWgiu7dmw5ETlLVOTTndh2u0KsZIQ8adxPmIRo&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-2.fna&_nc_gid=3ecFPUS7mpJRdNi7bi6b0w&oh=00_AfUSTsnx1hO1KYjqHV3vzbAXPV5MZqJIQvkxKMuBylg1fg&oe=68A8A528"},
      {photo :"https://scontent.ftbs5-4.fna.fbcdn.net/v/t51.82787-15/523756939_17851591875507299_7738301129925346664_n.jpg?stp=dst-jpegr_tt6&_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BZrXt03oC18Q7kNvwFs79Df&_nc_oc=AdnxJEeg27Qv-dVn-Xs1d36Ho0yTwib3QZfURA12K8LnoSzsOkr6ldT66A69gbBA0dc&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-4.fna&_nc_gid=yau0r4QgU4mZOpSpHhVUKA&oh=00_AfVPcc4hTviwJlar-rtzoEDXqqAZ4YXD_diQMByXzK4x-w&oe=68A8BE08"},
      {photo :"https://scontent.ftbs5-3.fna.fbcdn.net/v/t51.82787-15/523114123_17851590372507299_4360363543717187364_n.jpg?stp=dst-jpegr_tt6&_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=YSBiwUtCs08Q7kNvwGfCvXi&_nc_oc=AdkbDXIlFJ82-382pHSHaH67hCUhxrknxBlxkqUj2cJK4WRKv3FsEVkJK-r60NFC2Vc&_nc_zt=23&se=-1&_nc_ht=scontent.ftbs5-3.fna&_nc_gid=boxa8NEa1soIe3P65nQLoA&oh=00_AfWBa_B8sTuNJDYnSultNRY8GG-dcjdBa5JmHGEoInMXVA&oe=68A8C443"},
    ]
    for (let i = 0; i < count; i++) {
    const product = epoxyProducts[Math.floor(Math.random() * epoxyProducts.length)];
    const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    const photoUrl = this.gallery[Math.floor(Math.random() * this.gallery.length)].photo;
    
    randomCards.push({
      id:1,
      name: `${product}`,
      price: Math.floor(Math.random() * 300) + 20, 
      discountprice: 29,
      description,
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 500),
      photoUrl,
    });
  }


   this.cards = randomCards;
    return randomCards;
  }
}

export interface GalleryPhotos {
  photo: string;
}

export interface Posts{
  id:number
  price:number;
  discountprice:number;
  viewCount:number;
  likeCount:number;
  name:string;
  photoUrl:string;
  description:string;
}