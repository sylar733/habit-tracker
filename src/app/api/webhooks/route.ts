import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import User from '../../models/UserSchema';
import connectDB from '../../lib/conncetToDB';

export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: WEBHOOK_SECRET is missing');
    return new Response('Error: WEBHOOK_SECRET is missing', { status: 500 });
  }

  const webhook = new Webhook(SIGNING_SECRET);
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing Svix headers');
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;
  try {
    event = webhook.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Webhook verification failed:', err);
    return new Response('Error: Webhook verification failed', { status: 400 });
  }

  console.log('Webhook verified successfully.');
  console.log('Received payload:', JSON.stringify(event, null, 2));

  const { id } = event.data;
  const eventType = event.type;

  console.log(`Event type: ${eventType}`);
  console.log(`Event data: ID=${id}`);

  if (eventType === 'user.created') {
    const emailAddress = event.data.email_addresses?.[0]?.email_address;

    if (!emailAddress) {
      console.error('Error: Email address not found in payload');
      return new Response('Error: Email address not found in payload', { status: 400 });
    }

    try {
      console.log('Connecting to database...');
      await connectDB();
      console.log('Database connected.');

      console.log('Creating user with:', { clerkId: id, emailAddress });
      const user = new User({ clerkId: id, emailAddress });
      await user.save();
      console.log('User saved successfully:', user);

      return new Response('User created and saved successfully', { status: 200 });
    } catch (err) {
      console.error('Error saving user to the database:', err);
      return new Response('Error saving user to the database', { status: 500 });
    }
  }

  console.error('Error: Unsupported event type');
  return new Response('Error: Unsupported event type', { status: 400 });
}
