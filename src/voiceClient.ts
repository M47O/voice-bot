import { ElevenLabsClient } from "elevenlabs";

const voiceClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export default voiceClient;
