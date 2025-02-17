# Relay Server RPC

## Purpose

This document aims to create the JsonRpc contract between a client and a server.

## Definitions

The following definitions are shared concepts across all JSON-RPC methods for the Relay API:

- **topic** - (hex string - 32 bytes) a target topic for the message to be subscribed by the receiver.
- **message** - (utf8 string - variable) a plaintext message to be relayed to any subscribers on the topic.
- **attestation** - (utf8 string - variable) the Verify attestation JWT to be included along with the message. Not included in Verify API attestation.
- **ttl** - (uint32 - 4 bytes) a storage duration for the message to be cached server-side in **seconds** (aka time-to-live).
- **tag** - (uint32 - 4 bytes) a label that identifies what type of message is sent based on the RPC method used.
- **id** - 19 digit unique identifier. We suggest a 13 digit epoch timestamp plus 6 digit entropy


## Methods
### Publish

Used when a client publishes a message to a server.

```typescript
// Request (client->server)
{
  id: string,
  jsonrpc: "2.0",
  method: "irn_publish",
  params: {
    topic: string,
    message: string,
    attestation?: string | null,
    ttl: seconds,
    tag: number,
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```

### Batch Publish

Used when a client publishes multiple messages to a server.

```typescript
// PublishedMessage
{
  topic: string,
  message: string,
  attestation?: string | null,
  ttl: seconds,
  tag: number,
}

// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_batchPublish",
  "params" : {
    "messages": PublishedMessage[]
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```

### Subscribe

Used when a client subscribes a given topic.

```jsonc
// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_subscribe",
  "params" : {
    "topic" : string
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": string // subscriptionId
}
```

### Batch Subscribe

Used when a client subscribes multiple topics.

```jsonc
// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_batchSubscribe",
  "params" : {
    "topics" : string[]
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": string[] // array of subscriptionId's
}
```

### Unsubscribe

Used when a client unsubscribes a given topic.

```jsonc
// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_unsubscribe",
  "params" : {
    "topic" : string,
    "id": string
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```

### Batch Unsubscribe

Used when a client unsubscribes a given topic.

```jsonc
// Subscription
{
  "topic": string,
  "id": string
}

// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_batchUnsubscribe",
  "params" : {
    "subscriptions": Subscription[]
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```


### Subscription

Used when a server sends a subscription message to a client.

```jsonc
// Request (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_subscription",
  "params" : {
    "id" : string,
    "data" : {
      "topic": string,
      "message": string,
      "attestation": string | null,
      "publishedAt": number,
      "tag": number
    }
  }
}

// Response (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```

### Fetch Messages

Used when a client wants to fetch all undelivered messages matching a single topic before subscribing.

Response will include a flag `hasMore`. If true, the consumer should fetch again to get the rest of the messages. If false, then all messages have been delivered.

```jsonc
// ReceivedMessage
{
  "topic": string,
  "message": string,
  "publishedAt": number,
  "tag": number
}

// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_fetchMessages",
  "params" : {
    "topic": string
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": {
    "messages": ReceivedMessage[],
    "hasMore": boolean
  }
}
```



### Batch Fetch

Used when a client wants to fetch all undelivered messages matching multiple topics before subscribing.

Response will include a flag `hasMore`. If true, the consumer should fetch again to get the rest of the messages. If false, then all messages have been delivered.

```jsonc
// ReceivedMessage
{
  "topic": string,
  "message": string,
  "publishedAt": number,
  "tag": number
}

// Request (client->server)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_batchFetchMessages",
  "params" : {
    "topics": string[]
  }
}

// Response (server->client)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": {
    "messages": ReceivedMessage[],
    "hasMore": boolean
  }
}
```

### Batch Receive

Used to batch acknowledge receipt of messages from a subscribed client

```jsonc
// Receipt
{
  "topic": string,
  // Relay RPC message ID provided in the webhook event payload
  "messageId": number
}

// Request (service->relay)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_batchReceive",
  "params" : {
    // Max 500
    "receipts": Receipt[]
  }
}

// Response (relay->service)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```


### Register Watch (Webhook)

Used to register a webhook to watch relay messages matching a given client.

Watch events will be triggered for both incoming and outgoing messages but will not affect the delivery status of the messages in the mailbox.

```jsonc
// RegisterAuth Payload
{
   "act": string, // action (must be "irn_watchRegister")
   "typ": string, // either "subscriber" or "publisher"
   "iss": string, // clientId of the watched client
   "aud": string, // relayUrl
   "sub": string, // serviceUrl - the URL of the service receiving the request (e.g. https://api.example.com)
   "whu": string, // webhookUrl - the URL of the webhook (e.g. https://api.example.com/v1/relay-webhook) (max 256 characters)
   "iat": number, // issued at
   "exp": number, // expiry (max = 30 days)
   "tag": [1000, 1001, 1010, 1011], // array of tags
   "sts": ["accepted", "queued", "delivered"], // array of status
}

// Request (service->relay)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_watchRegister",
  "params" : {
    "registerAuth": string // JWT with RegisterAuth payload
  }
}

// Response (relay->service)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": {
    "relayId": string // relay public key (did:key)
  }
}
```

#### Watch Events (Webhook)

Future published message events will be triggered on the corresponding webhook url ("whu") with the following body payload.

`POST <WEBHOOK_URL>`

Body:

```jsonc
// EventAuth Payload
{
  "act": string, // action (must be "irn_watchEvent")
  "iss": string, // relayId
  "aud": string, // serviceUrl
  "typ": string, // either "subscriber" or "publisher"
  "sub": string, // clientId (matches "typ")
  "whu": string, // webhook url
  "iat": string, // issued at
  "evt": {       // published message event
    "messageId": number, // Relay RPC message ID which can be used for calling irn_batchReceive
    "status": string, // either "accepted", "queued" or "delivered"
    "topic": string,
    "message": string,
    "attestation": string | null,
    "publishedAt": number,
    "tag": number
  }
}


{
    // Max length 1
    "eventAuth": string[], // JWT with EventAuth payload
}
```

Response:

Response payload is ignored by relay, but SHOULD be a 204 or other 2xx status code.

5xx responses are retried by the relay with exponential backoff for at least 24 hours. 4xx responses are considered successful delivery and will not be retried.

### Unregister Watch (Webhook)

Used to unregister an active watch webhook corresponding to a webhookId.

```jsonc
// UnregisterAuth Payload
{
   "act": string, // action ("irn_watchUnregister")
   "iss": string, // clientId
   "aud": string, // relayUrl
   "sub": string, // serviceUrl
   "typ": string, // either "subscriber" or "publisher"
   "whu": string, // webhookUrl
   "iat": string, // issued at
}

// Request (service->relay)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "method": "irn_watchUnregister",
  "params" : {
    "unregisterAuth": string // jwt with UnregisterAuth payload
  }
}

// Response (relay->service)
{
  "id" : "1",
  "jsonrpc": "2.0",
  "result": true
}
```

## FAQ

- What is a client? - Any SDK instance (Sign, Chat, Auth, Push)
