import PusherClient from 'pusher-js';

// singleton instance for make sure there is only one pusher connection in the whole application
export const pusherClient =
    typeof window !== 'undefined'
        ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })
        : null;
        