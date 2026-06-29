# KomunaID - Typography

## Font Family

### Primary Font
- **Font**: Poppins
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Fallback**: sans-serif

## Usage

### Heading (Poppins SemiBold)
- H1: 36px / 44px line-height
- H2: 30px / 38px line-height
- H3: 24px / 32px line-height
- H4: 20px / 28px line-height
- H5: 18px / 26px line-height
- H6: 16px / 24px line-height

### Body (Poppins Regular)
- Body Large: 18px / 28px line-height
- Body: 16px / 24px line-height
- Body Small: 14px / 20px line-height

### Label (Poppins Regular)
- Label Large: 16px / 24px line-height
- Label: 14px / 20px line-height
- Label Small: 12px / 16px line-height

### CTA (Poppins SemiBold)
- CTA Large: 18px / 28px line-height
- CTA: 16px / 24px line-height
- CTA Small: 14px / 20px line-height

## Rules
1. Gunakan Poppins untuk seluruh text di aplikasi
2. SemiBold untuk heading dan CTA penting
3. Regular untuk body text dan label
4. Jangan gunakan terlalu banyak variasi font
5. Konsistenkan line-height dan spacing
6. Utamakan readability

## Implementation (Next.js)

```tsx
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});
```
