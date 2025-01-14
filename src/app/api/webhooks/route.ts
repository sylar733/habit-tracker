import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import User from '../../models/UserShecma'; // Adjust path as needed
import connectDB from '../../lib/conncetToDB'; // Adjust path as needed

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const wh = new Webhook(SIGNING_SECRET);

  // Await headers()
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log('Webhook payload:', body);

  if (eventType === 'user.created' && 'email_addresses' in evt.data) {
    const emailAddress = evt.data.email_addresses?.[0]?.email_address;

    if (emailAddress) {
      try {
        await connectDB();

        const user = new User({
          clerkId: id,
          emailAddress,
        });

        await user.save();

        console.log('User saved:', user);
      } catch (err) {
        console.error('Error saving user:', err);
        return new Response('Error saving user', { status: 500 });
      }
    } else {
      console.error('Error: Email address not found in payload');
      return new Response('Error: Email address missing in payload', {
        status: 400,
      });
    }
  } else {
    console.error('Error: Unsupported event type or missing email_addresses');
    return new Response('Error: Unsupported event type or payload', { status: 400 });
  }

  return new Response('Webhook received', { status: 200 });
}
