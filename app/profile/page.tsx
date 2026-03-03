import { Metadata } from 'next';
import { ProfilePageClient } from './ProfilePageClient';

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'View your system profile files and management instructions',
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
