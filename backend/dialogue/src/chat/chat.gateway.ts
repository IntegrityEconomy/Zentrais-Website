import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';  
import { UploadService } from '../upload/upload.service';

@WebSocketGateway({ cors: { origin:'*', methods: ['GET','POST'],}, transports: ['websocket'],})
export class ChatGateway implements OnGatewayConnection{
    @WebSocketServer()
    server: Server;
    constructor(private chatService: ChatService, private jwt : JwtService ,private uploadService: UploadService) {}

    // Authenticate and join a private room
    async handleConnection(socket: Socket) {
       try {
          const token = socket.handshake.auth.token;
          if (!token) throw new Error('Missing token');

          const payload = this.jwt.verify(token);
          console.log("Decoded payload:", payload);

          socket.data.userId = payload.userId;
          socket.join(payload.userId);

          console.log(`User connected: ${payload.userId}`);
        } catch (err) {
          console.error('Auth error:', err);
          socket.disconnect();
        }
    }

    
    @SubscribeMessage('send_message')
    async handleMessage (
        @MessageBody () data : { receiverId : string ; content : string ;mediaUrl : string ; type: 'TEXT' | 'IMAGE' | 'AUDIO';} ,
        @ConnectedSocket () socket : Socket ,
    ) {
        const senderId = socket.data.userId ;
        const receiverId=data.receiverId;
        //const receiverId=await this.chatService.getUserId(data.receiverUsername)
        const message = await this.chatService.saveMessage ({
                senderId,
                receiverId,
                type: data.type,
                content: data.type == 'TEXT' ? data.content : null,
                mediaUrl: data.type !='TEXT'? data.mediaUrl : null
        }) ;
        
        if (message.media_url && message.type !== 'TEXT') {
          message.media_url = await this.uploadService.getPresignedUrl(message.media_url);  
        }

       // Emit to sender + receiver only
       this.server.to(message.sender_id).emit ( 'receive_message', message ) ;
       this.server.to(message.receiver_id).emit ('receive_message', message ) ;
    }
    }
  
}



