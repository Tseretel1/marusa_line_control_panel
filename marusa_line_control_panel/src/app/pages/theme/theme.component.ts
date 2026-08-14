import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PostService, Shop, ShopUiSettings } from '../../shared/services/post.service';

export type AnimationShape = 'circle' | 'square' | 'triangle' | 'blob';

export interface ThemePreset {
  name: string;
  backgroundColor: string;
  backgroundOpacity: number;
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

const MIN_OPACITY = 0;

// The live shop site renders every "glass" surface (cards, header, footer,
// modals, ...) by multiplying its own fixed base alpha (hardcoded per
// element in marusa_line's CSS) by this same surfaceOpacity number. The
// product cards themselves (cards.component.scss, photo-album.component.scss)
// sit at the lowest base alpha, 0.36 — so the slider's max must be pegged to
// THAT value, not the highest one, otherwise the actual cards the shop owner
// is looking at can never reach true 1.0 (fully opaque) no matter how far the
// slider is dragged; they'd silently cap out partway (e.g. ~62% when pegged
// to 0.58) well before reaching the 100% mark. Elements with a higher base
// alpha than 0.36 simply hit 1.0 (and clip there, which is harmless — alpha
// can't exceed opaque) before the slider reaches its max. surfaceOpacity = 1
// (the longstanding default) still renders identically to how every shop
// already looks today.
const MAX_SURFACE_BASE_ALPHA = 0.36;
const MAX_SURFACE_OPACITY = 1 / MAX_SURFACE_BASE_ALPHA;

const DEFAULT_SETTINGS: ShopUiSettings = {
  shopId: 0,
  backgroundColor: '#ffffff',
  backgroundOpacity: 1,
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
  maxSurfaceOpacity = MAX_SURFACE_OPACITY;

  animationShapes: { value: AnimationShape; label: string }[] = [
    { value: 'blob', label: 'ბლობი' },
    { value: 'circle', label: 'წრე' },
    { value: 'square', label: 'კვადრატი' },
    { value: 'triangle', label: 'სამკუთხედი' },
  ];

  presets: ThemePreset[] = [
    { name: 'ღია',  backgroundColor: '#ffffff', backgroundOpacity: 1, textColor: '#ffffff', surfaceColor: '#000000', surfaceOpacity: MAX_SURFACE_OPACITY, backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#9ca3af' },
    { name: 'მუქი', backgroundColor: '#121212', backgroundOpacity: 1, textColor: '#f5f5f5', surfaceColor: '#2c2a2a', surfaceOpacity: 1.4, backgroundAnimationEnabled: true, backgroundAnimationShape: 'blob', backgroundAnimationColor: '#c2edff' },
  ];

  shopId: number = 0;
  shopName: string = '';
  shopLogo: string | null = null;

  saved: ShopUiSettings = { ...DEFAULT_SETTINGS };
  draft: ShopUiSettings = { ...DEFAULT_SETTINGS };

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
        this.saved = { ...DEFAULT_SETTINGS, ...data };
        this.draft = { ...DEFAULT_SETTINGS, ...data };
        this.loaded = true;
      },
    });
  }

  get isDirty(): boolean {
    return this.draft.backgroundColor.toLowerCase() !== this.saved.backgroundColor.toLowerCase()
        || this.draft.backgroundOpacity !== this.saved.backgroundOpacity
        || this.draft.textColor.toLowerCase() !== this.saved.textColor.toLowerCase()
        || this.draft.surfaceColor.toLowerCase() !== this.saved.surfaceColor.toLowerCase()
        || this.draft.surfaceOpacity !== this.saved.surfaceOpacity
        || this.draft.backgroundAnimationEnabled !== this.saved.backgroundAnimationEnabled
        || this.draft.backgroundAnimationShape !== this.saved.backgroundAnimationShape
        || this.draft.backgroundAnimationColor.toLowerCase() !== this.saved.backgroundAnimationColor.toLowerCase();
  }

  isActivePreset(preset: ThemePreset): boolean {
    return this.draft.backgroundColor.toLowerCase() === preset.backgroundColor.toLowerCase()
        && this.draft.backgroundOpacity === preset.backgroundOpacity
        && this.draft.textColor.toLowerCase() === preset.textColor.toLowerCase()
        && this.draft.surfaceColor.toLowerCase() === preset.surfaceColor.toLowerCase()
        && this.draft.surfaceOpacity === preset.surfaceOpacity
        && this.draft.backgroundAnimationEnabled === preset.backgroundAnimationEnabled
        && this.draft.backgroundAnimationShape === preset.backgroundAnimationShape
        && this.draft.backgroundAnimationColor.toLowerCase() === preset.backgroundAnimationColor.toLowerCase();
  }

  applyPreset(preset: ThemePreset): void {
    this.draft.backgroundColor = preset.backgroundColor;
    this.draft.backgroundOpacity = preset.backgroundOpacity;
    this.draft.textColor = preset.textColor;
    this.draft.surfaceColor = preset.surfaceColor;
    this.draft.surfaceOpacity = preset.surfaceOpacity;
    this.draft.backgroundAnimationEnabled = preset.backgroundAnimationEnabled;
    this.draft.backgroundAnimationShape = preset.backgroundAnimationShape;
    this.draft.backgroundAnimationColor = preset.backgroundAnimationColor;
  }

  toggleAnimation(): void {
    this.draft.backgroundAnimationEnabled = !this.draft.backgroundAnimationEnabled;
  }

  save(): void {
    if (this.saving) return;
    this.saving = true;
    this.service.updateShopUiSettings({
      backgroundColor: this.draft.backgroundColor,
      backgroundOpacity: this.draft.backgroundOpacity,
      textColor: this.draft.textColor,
      surfaceColor: this.draft.surfaceColor,
      surfaceOpacity: this.draft.surfaceOpacity,
      backgroundAnimationEnabled: this.draft.backgroundAnimationEnabled,
      backgroundAnimationShape: this.draft.backgroundAnimationShape,
      backgroundAnimationColor: this.draft.backgroundAnimationColor,
    }).subscribe({
      next: (data: ShopUiSettings) => {
        this.saving = false;
        this.saved = { ...DEFAULT_SETTINGS, ...data };
        this.draft = { ...DEFAULT_SETTINGS, ...data };
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

  surfaceRgba(weight: number = 1): string {
    const alpha = Math.min(1, Math.max(0, this.draft.surfaceOpacity * weight * MAX_SURFACE_BASE_ALPHA));
    return this.colorToRgba(this.draft.surfaceColor, alpha, '128, 128, 128');
  }

  backgroundRgba(): string {
    const alpha = Math.min(1, Math.max(0, this.draft.backgroundOpacity));
    return this.colorToRgba(this.draft.backgroundColor, alpha, '255, 255, 255');
  }

  private colorToRgba(hex: string | null | undefined, alpha: number, fallbackRgb: string): string {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex?.trim() ?? '');
    if (!match) {
      return `rgba(${fallbackRgb}, ${alpha})`;
    }
    const [r, g, b] = [match[1], match[2], match[3]].map((h) => parseInt(h, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
