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
  surfaceColor: string;
  surfaceOpacity: number;
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

const MIN_OPACITY = 0.3;
const MAX_OPACITY = 1.4;

const DEFAULT_SETTINGS: ShopUiSettings = {
  shopId: 0,
  backgroundColor: '#ffffff',
  textColor: '#000000',
  surfaceColor: '#808080',
  surfaceOpacity: 1,
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

  minOpacity = MIN_OPACITY;
  maxOpacity = MAX_OPACITY;

  animationShapes: { value: AnimationShape; label: string }[] = [
    { value: 'blob', label: 'ბლობი' },
    { value: 'circle', label: 'წრე' },
    { value: 'square', label: 'კვადრატი' },
    { value: 'triangle', label: 'სამკუთხედი' },
  ];

  presets: ThemePreset[] = [
    { name: 'ღია',  backgroundColor: '#ffffff', textColor: '#000000', surfaceColor: '#000000', surfaceOpacity: 1, backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#9ca3af' },
    { name: 'მუქი', backgroundColor: '#121212', textColor: '#f5f5f5', surfaceColor: '#ffffff', surfaceOpacity: 1, backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#38bdf8' },
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
        || this.draft.surfaceColor.toLowerCase() !== this.saved.surfaceColor.toLowerCase()
        || this.draft.surfaceOpacity !== this.saved.surfaceOpacity
        || this.draft.backgroundAnimationEnabled !== this.saved.backgroundAnimationEnabled
        || this.draft.backgroundAnimationShape !== this.saved.backgroundAnimationShape
        || this.draft.backgroundAnimationColor.toLowerCase() !== this.saved.backgroundAnimationColor.toLowerCase();
  }

  isActivePreset(preset: ThemePreset): boolean {
    return this.draft.backgroundColor.toLowerCase() === preset.backgroundColor.toLowerCase()
        && this.draft.textColor.toLowerCase() === preset.textColor.toLowerCase()
        && this.draft.surfaceColor.toLowerCase() === preset.surfaceColor.toLowerCase()
        && this.draft.surfaceOpacity === preset.surfaceOpacity
        && this.draft.backgroundAnimationEnabled === preset.backgroundAnimationEnabled
        && this.draft.backgroundAnimationShape === preset.backgroundAnimationShape
        && this.draft.backgroundAnimationColor.toLowerCase() === preset.backgroundAnimationColor.toLowerCase();
  }

  applyPreset(preset: ThemePreset): void {
    this.draft.backgroundColor = preset.backgroundColor;
    this.draft.textColor = preset.textColor;
    this.draft.surfaceColor = preset.surfaceColor;
    this.draft.surfaceOpacity = preset.surfaceOpacity;
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
      surfaceColor: this.draft.surfaceColor,
      surfaceOpacity: this.draft.surfaceOpacity,
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

  surfaceRgba(baseAlpha: number): string {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.draft.surfaceColor?.trim() ?? '');
    const alpha = Math.min(1, baseAlpha * this.draft.surfaceOpacity);
    if (!match) {
      return `rgba(128, 128, 128, ${alpha})`;
    }
    const [r, g, b] = [match[1], match[2], match[3]].map((h) => parseInt(h, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
