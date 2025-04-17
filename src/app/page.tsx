import { redirect } from 'next/navigation';

// Simple redirect page - no UI rendering needed
export default function RootPage() {
  redirect('/en');
}
