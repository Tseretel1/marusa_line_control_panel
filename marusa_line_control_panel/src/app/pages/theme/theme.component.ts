import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PostService, Shop, ShopUiSettings } from '../../shared/services/post.service';

export type AnimationShape = 'circle' | 'square' | 'triangle' | 'blob';

export interface ThemePreset {
  name: string;
  backgroundColor: string;
  textColor: string;
  backgroundAnimationEnabled: boolean;
  backgroundAnimationShape: AnimationShape;
  backgroundAnimationColor: string;
}

interface PreviewShapeLayout {
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

const DEFAULT_SETTINGS: ShopUiSettings = {
  shopId: 0,
  backgroundColor: '#ffffff',
  textColor: '#000000',
  backgroundAnimationEnabled: true,
  backgroundAnimationShape: 'blob',
  backgroundAnimationColor: '#9ca3af',
};

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent implements OnInit {

  animationShapes: { value: AnimationShape; label: string }[] = [
    { value: 'blob', label: 'ბლობი' },
    { value: 'circle', label: 'წრე' },
    { value: 'square', label: 'კვადრატი' },
    { value: 'triangle', label: 'სამკუთხედი' },
  ];

  presets: ThemePreset[] = [
    { name: 'კლასიკური', backgroundColor: '#ffffff', textColor: '#000000', backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#9ca3af' },
    { name: 'მუქი',       backgroundColor: '#121212', textColor: '#f5f5f5', backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#38bdf8' },
    { name: 'მინიმალური', backgroundColor: '#ffffff', textColor: '#1f2937', backgroundAnimationEnabled: false, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#9ca3af' },
    { name: 'ოკეანე',     backgroundColor: '#e8f4f8', textColor: '#073b4c', backgroundAnimationEnabled: true, backgroundAnimationShape: 'circle', backgroundAnimationColor: '#38bdf8' },
    { name: 'ტყე',        backgroundColor: '#f1f8e9', textColor: '#1b5e20', backgroundAnimationEnabled: true, backgroundAnimationShape: 'triangle', backgroundAnimationColor: '#66bb6a' },
  ];

  shopId: number = 0;
  shopName: string = '';
  shopLogo: string | null = null;

  saved: ShopUiSettings = { ...DEFAULT_SETTINGS };
  draft: ShopUiSettings = { ...DEFAULT_SETTINGS };

  customizeOpen: boolean = false;
  saving: boolean = false;
  loaded: boolean = false;

  previewShapes: PreviewShapeLayout[] = [];

  constructor(private service: PostService) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.previewShapes = this.generatePreviewLayout(14);
    this.service.getShopById().subscribe({
      next: (data: Shop) => {
        this.shopId = data.id;
        this.shopName = data.name;
        this.shopLogo = data.logo;
        this.loadTheme();
      },
    });
  }

  private generatePreviewLayout(count: number): PreviewShapeLayout[] {
    return Array.from({ length: count }, () => ({
      size: Math.round(10 + Math.random() * 26),
      left: Math.round(Math.random() * 100),
      top: Math.round(Math.random() * 100),
      duration: Math.round(10 + Math.random() * 14),
      delay: -Math.round(Math.random() * 14),
    }));
  }

  loadTheme(): void {
    this.service.getShopUiSettings(this.shopId).subscribe({
      next: (data: ShopUiSettings) => {
        this.saved = { ...data };
        this.draft = { ...data };
        this.loaded = true;
      },
    });
  }

  get isDirty(): boolean {
    return this.draft.backgroundColor.toLowerCase() !== this.saved.backgroundColor.toLowerCase()
        || this.draft.textColor.toLowerCase() !== this.saved.textColor.toLowerCase()
        || this.draft.backgroundAnimationEnabled !== this.saved.backgroundAnimationEnabled
        || this.draft.backgroundAnimationShape !== this.saved.backgroundAnimationShape
        || this.draft.backgroundAnimationColor.toLowerCase() !== this.saved.backgroundAnimationColor.toLowerCase();
  }

  isActivePreset(preset: ThemePreset): boolean {
    return this.draft.backgroundColor.toLowerCase() === preset.backgroundColor.toLowerCase()
        && this.draft.textColor.toLowerCase() === preset.textColor.toLowerCase()
        && this.draft.backgroundAnimationEnabled === preset.backgroundAnimationEnabled
        && this.draft.backgroundAnimationShape === preset.backgroundAnimationShape
        && this.draft.backgroundAnimationColor.toLowerCase() === preset.backgroundAnimationColor.toLowerCase();
  }

  applyPreset(preset: ThemePreset): void {
    this.draft.backgroundColor = preset.backgroundColor;
    this.draft.textColor = preset.textColor;
    this.draft.backgroundAnimationEnabled = preset.backgroundAnimationEnabled;
    this.draft.backgroundAnimationShape = preset.backgroundAnimationShape;
    this.draft.backgroundAnimationColor = preset.backgroundAnimationColor;
  }

  openCustomize(): void {
    this.customizeOpen = !this.customizeOpen;
  }

  toggleAnimation(): void {
    this.draft.backgroundAnimationEnabled = !this.draft.backgroundAnimationEnabled;
  }

  save(): void {
    if (this.saving) return;
    this.saving = true;
    this.service.updateShopUiSettings({
      backgroundColor: this.draft.backgroundColor,
      textColor: this.draft.textColor,
      backgroundAnimationEnabled: this.draft.backgroundAnimationEnabled,
      backgroundAnimationShape: this.draft.backgroundAnimationShape,
      backgroundAnimationColor: this.draft.backgroundAnimationColor,
    }).subscribe({
      next: (data: ShopUiSettings) => {
        this.saving = false;
        this.saved = { ...data };
        this.draft = { ...data };
        Swal.fire({
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: 'rgb(25, 26, 25)',
          color: '#ffffff',
          title: 'თემა წარმატებით შეინახა',
        });
      },
      error: () => {
        this.saving = false;
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          background: 'rgb(25, 26, 25)',
          color: '#ffffff',
          title: 'თემის შენახვა ვერ მოხერხდა',
        });
      },
    });
  }

  cancel(): void {
    this.draft = { ...this.saved };
  }
}
