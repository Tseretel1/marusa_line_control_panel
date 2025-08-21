import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'] 
})

export class LoaderComponent {
  loading$!: Observable<boolean>;
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
  }
}
