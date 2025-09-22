import React from 'react';
import { render } from '@testing-library/react';
import VirtualizationIcon from '@/components/VirtualizationIcon';
import { VirtualizationType } from '@/utils/virtualizationUtil';

describe('VirtualizationIcon', () => {
  it('renders physical hardware icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.PHYSICAL} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Vercel cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.VERCEL} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders AWS Lambda cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.AWS_LAMBDA} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Azure Functions cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.AZURE_FUNCTIONS} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Google Cloud Platform icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.GOOGLE_CLOUD_PLATFORM} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Heroku cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.HEROKU} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Railway cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.RAILWAY} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Netlify cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.NETLIFY} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Render cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.RENDER} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Fly.io cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.FLY_IO} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders DigitalOcean cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.DIGITAL_OCEAN} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Linode cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.LINODE} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders Vultr cloud icon', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.VULTR} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders unknown icon for unknown type', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.UNKNOWN} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders question icon for invalid type', () => {
    const { container } = render(<VirtualizationIcon virtualizationType={VirtualizationType.Invalid} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <VirtualizationIcon 
        virtualizationType={VirtualizationType.PHYSICAL} 
        className="w-8 h-8" 
      />
    );
    expect(container.firstChild).toHaveClass('w-8', 'h-8');
  });
});
