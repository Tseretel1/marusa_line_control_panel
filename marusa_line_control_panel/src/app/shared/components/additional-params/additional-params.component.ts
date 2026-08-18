import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService, ProductAdditionalParamDto } from '../../services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-additional-params',
  imports: [CommonModule, FormsModule],
  templateUrl: './additional-params.component.html',
  styleUrl: './additional-params.component.scss'
})
export class AdditionalParamsComponent implements OnInit {

  @Input() productId: number | null = null;
  @Input() assignedParamIds: number[] = [];
  @Output() assignedParamIdsChange = new EventEmitter<number[]>();

  constructor(private postService: PostService) {}

  catalog: ProductAdditionalParamDto[] = [];
  assignedIds: Set<number> = new Set();

  newParamName: string = '';
  newValueInputs: { [parameterId: number]: string } = {};

  addingParam: boolean = false;
  activeAddValueParamId: number | null = null;

  modalVisible: boolean = false;
  openModal(): void { this.modalVisible = true; }
  closeModal(): void { this.modalVisible = false; }

  ngOnInit(): void {
    this.postService.GetShopAdditionalParameters().subscribe({
      next: (resp) => { this.catalog = resp; },
      error: (err) => console.error('Failed to load additional parameters', err)
    });

    if (this.productId != null) {
      this.postService.GetProductAdditionalParams(this.productId).subscribe({
        next: (resp) => { this.assignedIds = new Set(resp.map(p => p.parameterId)); },
        error: (err) => console.error('Failed to load product additional parameters', err)
      });
    } else {
      this.assignedIds = new Set(this.assignedParamIds);
    }
  }

  isAssigned(parameterId: number): boolean {
    return this.assignedIds.has(parameterId);
  }

  get assignedParamsList(): ProductAdditionalParamDto[] {
    return this.catalog.filter(p => this.isAssigned(p.parameterId));
  }

  toggleParam(parameterId: number): void {
    if (this.productId != null) {
      const productId = this.productId;
      if (this.isAssigned(parameterId)) {
        this.postService.RemoveAdditionalParam(productId, parameterId).subscribe({
          next: (resp) => { this.assignedIds = new Set(resp.map(p => p.parameterId)); },
          error: (err) => console.error('Failed to remove parameter', err)
        });
      } else {
        this.postService.AssignAdditionalParam(productId, parameterId).subscribe({
          next: (resp) => { this.assignedIds = new Set(resp.map(p => p.parameterId)); },
          error: (err) => console.error('Failed to assign parameter', err)
        });
      }
      return;
    }

    const next = new Set(this.assignedIds);
    if (next.has(parameterId)) {
      next.delete(parameterId);
    } else {
      next.add(parameterId);
    }
    this.assignedIds = next;
    this.assignedParamIdsChange.emit(Array.from(next));
  }

  startAddParam(): void {
    this.addingParam = true;
    this.newParamName = '';
  }

  cancelAddParam(): void {
    this.addingParam = false;
    this.newParamName = '';
  }

  confirmAddParam(): void {
    const paramName = this.newParamName.trim();
    if (!paramName) return;

    this.postService.CreateAdditionalParameter(paramName).subscribe({
      next: (resp) => {
        this.catalog = resp;
        this.newParamName = '';
        this.addingParam = false;
      },
      error: (err) => console.error('Failed to create parameter', err)
    });
  }

  startAddValue(parameterId: number): void {
    this.activeAddValueParamId = parameterId;
    this.newValueInputs[parameterId] = '';
  }

  cancelAddValue(): void {
    this.activeAddValueParamId = null;
  }

  confirmAddValue(parameterId: number): void {
    const value = (this.newValueInputs[parameterId] || '').trim();
    if (!value) return;

    this.postService.CreateAdditionalParameterValue(parameterId, value).subscribe({
      next: (resp) => {
        this.catalog = resp;
        this.newValueInputs[parameterId] = '';
        this.activeAddValueParamId = null;
      },
      error: (err) => console.error('Failed to create parameter value', err)
    });
  }

  deleteValue(valueId: number): void {
    this.postService.DeleteAdditionalParameterValue(valueId).subscribe({
      next: (resp) => { this.catalog = resp; },
      error: (err) => {
        if (err.error?.usedInOrders) {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background: 'rgb(25, 26, 25)',
            color: '#ffffff',
            title: 'მნიშვნელობა გამოყენებულია შეკვეთებში და მისი წაშლა შეუძლებელია',
          });
        } else {
          console.error('Failed to delete value', err);
        }
      }
    });
  }

  deleteParameter(parameterId: number): void {
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'არა',
      cancelButtonColor: 'red',
      confirmButtonText: 'დიახ',
      background: 'rgb(25, 26, 25)',
      color: '#ffffff',
      confirmButtonColor: 'green',
      title: 'ნამდვილად გსურთ პარამეტრის წაშლა?',
    }).then((results) => {
      if (!results.isConfirmed) return;

      this.postService.DeleteAdditionalParameter(parameterId).subscribe({
        next: (resp) => {
          this.catalog = resp;
          this.assignedIds.delete(parameterId);
        },
        error: (err) => {
          if (err.error?.usedInOrders) {
            Swal.fire({
              icon: 'error',
              timer: 3000,
              showConfirmButton: false,
              confirmButtonColor: 'green',
              background: 'rgb(25, 26, 25)',
              color: '#ffffff',
              title: 'პარამეტრი გამოყენებულია შეკვეთებში და მისი წაშლა შეუძლებელია',
            });
          } else {
            console.error('Failed to delete parameter', err);
          }
        }
      });
    });
  }
}
