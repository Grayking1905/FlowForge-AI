// FlowForge AI — WebSocket Client (STOMP over SockJS)
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws'

let stompClient = null
const subscriptions = new Map()
const listeners = new Map()

export function connectWebSocket(onConnected) {
  if (stompClient?.connected) {
    onConnected?.()
    return
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('[WS] Connected')
      // Re-subscribe all pending subscriptions
      for (const [dest, callback] of listeners) {
        subscribeInternal(dest, callback)
      }
      onConnected?.()
    },
    onStompError: (frame) => {
      console.error('[WS] STOMP error:', frame.headers?.message)
    },
    onDisconnect: () => {
      console.log('[WS] Disconnected')
    },
  })

  stompClient.activate()
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    subscriptions.clear()
    listeners.clear()
  }
}

function subscribeInternal(destination, callback) {
  if (!stompClient?.connected) return
  // Unsubscribe existing
  if (subscriptions.has(destination)) {
    subscriptions.get(destination).unsubscribe()
  }
  const sub = stompClient.subscribe(destination, (msg) => {
    try {
      const body = JSON.parse(msg.body)
      callback(body)
    } catch (e) {
      callback(msg.body)
    }
  })
  subscriptions.set(destination, sub)
}

export function subscribe(destination, callback) {
  listeners.set(destination, callback)
  if (stompClient?.connected) {
    subscribeInternal(destination, callback)
  }
}

export function unsubscribe(destination) {
  listeners.delete(destination)
  if (subscriptions.has(destination)) {
    subscriptions.get(destination).unsubscribe()
    subscriptions.delete(destination)
  }
}

export function sendWsMessage(destination, body) {
  if (stompClient?.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    })
  }
}

// Convenience: subscribe to channel messages
export function subscribeToChannel(channelId, onMessage) {
  subscribe(`/topic/channel.${channelId}`, onMessage)
}

export function unsubscribeFromChannel(channelId) {
  unsubscribe(`/topic/channel.${channelId}`)
}

// Convenience: subscribe to personal notifications
export function subscribeToNotifications(userId, onNotification) {
  subscribe(`/queue/notifications.${userId}`, onNotification)
}

// Convenience: send typing indicator
export function sendTypingIndicator(channelId, userId, userName, typing = true) {
  sendWsMessage('/app/chat.typing', { channelId, userId, userName, typing })
}

// Convenience: subscribe to typing
export function subscribeToTyping(channelId, onTyping) {
  subscribe(`/topic/channel.${channelId}.typing`, onTyping)
}

export function isConnected() {
  return stompClient?.connected ?? false
}
