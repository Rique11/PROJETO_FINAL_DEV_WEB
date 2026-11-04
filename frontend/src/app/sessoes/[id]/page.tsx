import { INITIAL_SESSIONS } from '@/data/fixtures';
import SessionDetailClient from './SessionDetailClient';

export function generateStaticParams() {
  return INITIAL_SESSIONS.map((session) => ({
    id: session.id,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SessionDetailClient sessionId={id} />;
}
