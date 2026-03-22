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
      SubName: 'სტანდარტული',
      SubPrice: 99,
      SubDetails: [
        'მაღაზიის მოწყობა',
        'პროდუქტების ატვირთვა / რედაქტირება',
        'კატეგორიების მართვა',
        'მარაგის კონტროლი',
        'გამომწერების მენეჯმენტი',
        'შეკვეთების სრული მენეჯმენტი',
        'შემოსავლების სრული სტატისტიკა',
      ]
    },
    {
      SubName: 'პრემიუმი',
      SubPrice: 149,
      SubDetails: [
        'coming soon',
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
