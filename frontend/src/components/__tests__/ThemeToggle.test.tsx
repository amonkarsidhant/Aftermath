import { fireEvent, render, screen } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('saves and applies the preferred theme', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
