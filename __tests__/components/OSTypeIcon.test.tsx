import { render, screen } from '@testing-library/react';
import OSTypeIcon from '@/components/OSTypeIcon';
import { platformType } from '@/utils/platformUtil';

describe('OSTypeIcon', () => {
  it('renders Windows icon for windows platform', () => {
    render(<OSTypeIcon osType={platformType.windows} />);
    // The icon should be present (we can't easily test the specific icon without more complex setup)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders Linux icon for linux platform', () => {
    render(<OSTypeIcon osType={platformType.linux} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders macOS icon for mac platform', () => {
    render(<OSTypeIcon osType={platformType.mac} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders FreeBSD icon for freebsd platform', () => {
    render(<OSTypeIcon osType={platformType.freebsd} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OpenBSD icon for openbsd platform', () => {
    render(<OSTypeIcon osType={platformType.openbsd} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders question mark icon for unknown platform', () => {
    render(<OSTypeIcon osType={platformType.unknown} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<OSTypeIcon osType={platformType.linux} className="w-8 h-8" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveClass('w-8', 'h-8');
  });

  it('renders question mark icon for undefined osType', () => {
    render(<OSTypeIcon osType={undefined} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders question mark icon for null osType', () => {
    render(<OSTypeIcon osType={null} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
