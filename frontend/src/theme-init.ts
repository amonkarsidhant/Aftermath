const stored = localStorage.getItem('theme');
let theme: 'light' | 'dark';
if (stored === 'light' || stored === 'dark') {
  theme = stored;
} else {
  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  theme = prefersDark ? 'dark' : 'light';
}
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}
