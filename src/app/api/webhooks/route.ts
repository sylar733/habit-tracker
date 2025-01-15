import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import User from '../../models/UserShecma'; // Adjust path if needed
import connectDB from '../../lib/conncetToDB'; // Adjust path if needed

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  // Validate that the SIGNING_SECRET is present
  if (!SIGNING_SECRET) {
    console.error('Error: SIGNING_SECRET is missing');
    return new Response('Error: SIGNING_SECRET is missing', { status: 500 });
  }

  const webhook = new Webhook(SIGNING_SECRET);

  // Get headers from the request
// Await the resolution of the headers() promise
const headerPayload = await headers();

// Safely access the headers using .get()
const svix_id = headerPayload.get('svix-id');
const svix_timestamp = headerPayload.get('svix-timestamp');
const svix_signature = headerPayload.get('svix-signature');


  // Validate that the required Svix headers are present
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing Svix headers');
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Parse and verify the webhook payload
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

  // Extract event data
  const { id } = event.data;
  const eventType = event.type;

  console.log(`Received webhook with ID ${id} and event type: ${eventType}`);
  console.log('Webhook payload:', payload);

  // Handle the `user.created` event
  if (eventType === 'user.created') {
    const emailAddress = event.data.email_addresses?.[0]?.email_address;

    if (!emailAddress) {
      console.error('Error: Email address not found in payload');
      return new Response('Error: Email address not found in payload', { status: 400 });
    }

    try {
      // Connect to the database
      await connectDB();

      // Save the user to MongoDB
      const user = new User({
        clerkId: id,
        emailAddress,
        createdAt: new Date(), // Add a timestamp for when the user is created
      });

      await user.save();
      console.log('User saved successfully:', user);

      return new Response('User created and saved successfully', { status: 200 });
    } catch (err) {
      console.error('Error saving user to the database:', err);
      return new Response('Error saving user to the database', { status: 500 });
    }
  } else {
    console.error('Error: Unsupported event type or missing required data');
    return new Response('Error: Unsupported event type or missing required data', { status: 400 });
  }
}
