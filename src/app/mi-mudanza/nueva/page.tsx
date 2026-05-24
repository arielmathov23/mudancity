import { AppShell } from '@/components/layout/AppShell';
import { CreateMoveForm } from '@/components/owner/CreateMoveForm';

export default function NewMovePage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Nueva mudanza</h1>
        <CreateMoveForm redirectBase="/mi-mudanza" />
      </div>
    </AppShell>
  );
}
