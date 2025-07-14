// My auth config for the evaluation API
export const AUTH_CONFIG = {
  email: "yourcollegeemail@lpu.in",
  name: "Aditya Gupta",
  rollNo: "12319077",
  accessCode: "yourAccessCodeFromEmail", // Put your real access code here
  clientID: "yourClientID", // Put your real client ID here
  clientSecret: "yourClientSecret" // Put your real client secret here
};

export const API_BASE_URL = "http://20.244.56.144/eva1uation-service";

// How to set this up:
// 1. Register first with the /register endpoint
// 2. Get your clientID and clientSecret from the response
// 3. Put those real values in the config above
// 4. The logger will handle the rest automatically
