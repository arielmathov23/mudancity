import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ moveId: string }>;
}

export default async function LegacyMoveRedirect({ params }: PageProps) {
  const { moveId } = await params;
  redirect(`/mi-mudanza/${moveId}`);
}
