'use server';

export async function sendTest(to: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/send-test-email/${to}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to send test email');
  }

  return { success: true };
}