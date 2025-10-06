import { handleOfficeStaffQuestions } from "./officeStaff.ts";
import { handleGeneralLifeQuestions } from "./generalLife.ts";
import { handleTollywoodQuestions } from "./tollywood.ts";
import { handleHealthWellnessQuestions } from "./health.ts";
import { handleGreetings } from "./greetings.ts";

export const handleConversationalTidbits = (message: string): string | null => {
  // Try each knowledge domain in order
  let reply = handleGreetings(message);
  if (reply) return reply;

  reply = handleOfficeStaffQuestions(message);
  if (reply) return reply;

  reply = handleGeneralLifeQuestions(message);
  if (reply) return reply;

  reply = handleHealthWellnessQuestions(message);
  if (reply) return reply;

  reply = handleTollywoodQuestions(message);
  if (reply) return reply;

  return null;
};
