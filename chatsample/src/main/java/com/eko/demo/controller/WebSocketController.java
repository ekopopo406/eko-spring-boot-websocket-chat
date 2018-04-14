package com.eko.demo.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;

@Controller
public class WebSocketController {

	@Autowired
	private SimpMessageSendingOperations messagingTemplate;

	@SubscribeMapping("/usermessage/{userId}")
	@SendToUser("/queue/reply")
	public void processMessageFromClient(@Payload String message, Principal principal,@DestinationVariable String userId) throws Exception {
		System.out.println(message+userId);
		 String name = new Gson().fromJson(message, Map.class).get("talkto").toString();
		messagingTemplate.convertAndSendToUser(userId, "/queue/reply",principal.getName()+"-"+name);
	}
	@MessageMapping("/allmessage")
	@SendTo("/topic/reply")
	public void processallMessageFromClient(@Payload String message, Principal principal) throws Exception {
		 String name = new Gson().fromJson(message, Map.class).get("name").toString();
		messagingTemplate.convertAndSend("/topic/reply",principal.getName()+"-"+name);
	}
	@MessageExceptionHandler
	@SendToUser("/queue/reply")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }

}
