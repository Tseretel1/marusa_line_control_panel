import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss'
})
export class SubscriptionsComponent {
  selectedPlan: string = '';
  constructor(){
    const sub = localStorage.getItem('subPlan')
    if(sub){
      this.selectedPlan = sub;
      console.log(this.selectedPlan)
    }
  }
  subscriptionPlans: Subscription[] = [
    {
      SubName: 'მინიმალური',
      SubPrice: 99,
      SubDetails: [
        'მაღაზიის მოწყობა',
        'პროდუქტების ატვირთვა / რედაქტირება',
        'კატეგორიების მართვა',
        'მარაგის კონტროლი',
        'შეკვეთების სრული მენეჯმენტი',
        'შეტყობინებები მიღებულ შეკვეთებზე',
      ]
    },
    {
      SubName: 'პრემიუმი',
      SubPrice: 149,
      SubDetails: [
        'მინიმალური პაკეტი',
        'გამომწერების მენეჯმენტი',
        'ყოველთვიური სტატისტიკა',
        'წლის სრული სტატისტიკა',
        'გაყიდული შეკვეთებისა და შემოსავლების სტატისტიკა',
        'პირადი IT დამხამრე 24/7',
      ]
    },
    // {
    //   SubName: 'ენტერპრაიზი',
    //   SubPrice: 199,
    //   SubDetails: [
    //     'მინიმალური პაკეტი',
    //     'პრემიუმ პაკეტი',
    //     'იმეილ სისტემა',
    //     'სიახლეების გაზიარება გამომწერებთან',
    //     'რეკლამები',
    //   ]
    // }
  ];

}
export interface Subscription {
  SubName: string;
  SubPrice: number;
  SubDetails: string[];
}
