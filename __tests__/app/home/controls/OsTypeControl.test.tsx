import { render, screen } from '@testing-library/react';
import { OsTypeControl } from '@/app/home/controls/OsTypeControl';
import { platformType } from '@/utils/platformUtil';

describe('OsTypeControl', () => {
  it('renders OS type control with Linux platform', () => {
    render(<OsTypeControl osType={platformType.linux} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OS type control with Windows platform', () => {
    render(<OsTypeControl osType={platformType.windows} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OS type control with macOS platform', () => {
    render(<OsTypeControl osType={platformType.mac} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('macOS')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OS type control with unknown platform', () => {
    render(<OsTypeControl osType={platformType.unknown} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OS type control with undefined osType', () => {
    render(<OsTypeControl osType={undefined} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders OS type control with null osType', () => {
    render(<OsTypeControl osType={null} />);
    
    expect(screen.getByText('OS Type')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
