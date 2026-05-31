UI Guide — Runway 519

Overview
- This guide explains how the UI is structured, how to change theme/colors, and accessibility considerations.

Theme & Colors
- The app uses CSS variables in `app/globals.css` for colors (e.g., `--background`, `--foreground`).
- Dark mode is toggled via a `dark` class on the `<html>` element. Use the `ThemeToggle` component at `app/components/ThemeToggle.js`.
- To change color tokens, edit `app/globals.css` variables or extend Tailwind colors in `tailwind.config.js`.

Accessibility
- A visible "Skip to content" link is present in `app/layout.tsx` for keyboard users.
- Focus styles use `focus:ring` via Tailwind and a `.focus-ring` helper in CSS.
- All interactive elements include accessible labels and `aria-*` attributes where applicable.

Responsiveness
- Layout uses Tailwind responsive utilities; mobile breakpoints are `sm`, `md`, `lg` etc.
- Components use fluid containers (`max-w-7xl`, `px-4`) to adapt to screen sizes.

How to alter theme programmatically
- The theme is persisted in `localStorage` under `theme`. Values: `light` or `dark`.
- To programmatically set theme:

```js
localStorage.setItem('theme', 'dark');
document.documentElement.classList.add('dark');
```

Development notes
- Rebuild the client with `cd client && npm run build` for production assets.
- Edit components under `app/components/` for shared UI changes.

Design references
- Mobile and accessibility decisions follow platform guidelines (Apple Human Interface Guidelines and WCAG). Ensure color contrast and touch target sizes when changing styles.

Contact
- If you want, I can add a Storybook setup or a small component library to make altering UI even easier.
