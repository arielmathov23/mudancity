import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ moveId: string }>;
}

export default async function MoveDetailPage({ params }: PageProps) {
  const { moveId } = await params;
  redirect(`/mi-mudanza?moveId=${moveId}`);
}
