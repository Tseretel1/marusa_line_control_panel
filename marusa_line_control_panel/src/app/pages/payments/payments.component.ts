import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService, PayScheduleDto } from '../../shared/services/post.service';

const MONTH_NAMES = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
];

@Component({
  selector: 'app-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

  constructor(private service: PostService) {
    this.loadPayments();
  }

  selectedYear: number = new Date().getFullYear();
  payments: PayScheduleDto[] = [];
  months: MonthSquare[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';

  loadPayments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getMyPaySchedule(this.selectedYear).subscribe({
      next: (resp) => {
        this.payments = resp;
        this.buildMonths();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? err?.error ?? 'შეცდომა მონაცემების ჩატვირთვისას';
        this.payments = [];
        this.buildMonths();
        this.isLoading = false;
      }
    });
  }

  buildMonths(): void {
    this.months = MONTH_NAMES.map((name, idx) => {
      const monthNumber = idx + 1;
      const payment = this.payments.find(p => new Date(p.payDate).getMonth() + 1 === monthNumber) ?? null;
      return {
        monthNumber,
        name,
        isPaid: !!payment,
        payment
      };
    });
  }

  previousYear(): void {
    this.selectedYear--;
    this.loadPayments();
  }
  nextYear(): void {
    this.selectedYear++;
    this.loadPayments();
  }
  onYearInputChange(): void {
    this.loadPayments();
  }

  modalVisible: boolean = false;
  selectedMonth: MonthSquare | null = null;
  openMonthModal(month: MonthSquare): void {
    if (!month.isPaid) return;
    this.selectedMonth = month;
    this.modalVisible = true;
  }
  hideModal(): void {
    this.modalVisible = false;
    this.selectedMonth = null;
  }
}

export interface MonthSquare {
  monthNumber: number;
  name: string;
  isPaid: boolean;
  payment: PayScheduleDto | null;
}
