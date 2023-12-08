import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketIo from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
    constructor(app: INestApplication) {
        super(app);
    }

    createIOServer(port: number, options?: socketIo.ServerOptions): socketIo.Server {
        return super.createIOServer(port, { ...options, cors: true });
    }
}
