import PusherClient from 'pusher-js';
import { api } from '@/lib/axios';

const key = process.env.NEXT_PUBLIC_PUSHER_KEY;

export const pusherClient =
    typeof window !== 'undefined' && key
        ? new PusherClient(key, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            // Lewat axios supaya otorisasi channel privat membawa sesi yang sama dengan API lain.
            channelAuthorization: {
                transport: 'ajax',
                endpoint: '/pusher/auth',
                customHandler: ({ socketId, channelName }, callback) => {
                    api
                        .post('/pusher/auth', { socket_id: socketId, channel_name: channelName })
                        .then((res) => callback(null, res.data))
                        .catch((error: Error) => callback(error, null));
                },
            },
        })
        : null;
