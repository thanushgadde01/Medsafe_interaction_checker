import { auth, redirect } from '@clerk/nextjs';
import { LandingPage } from '@/components/landing-page';

export default function Home() {
  const { userId } = auth();

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
