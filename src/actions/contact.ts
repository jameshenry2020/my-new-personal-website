"use server";

import { contactMessageSchema } from "@/validators";
import { saveContactMessage } from "@/services/db.service";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  // Validate using Zod
  const validation = contactMessageSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Please fix the validation errors below.",
    };
  }

  try {
    await saveContactMessage(validation.data);
    revalidatePath("/admin");
    return {
      success: true,
      errors: null,
      message: "Your message has been sent successfully. Henry will review it shortly.",
    };
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return {
      success: false,
      errors: null,
      message: "An error occurred while sending your message. Please try again.",
    };
  }
}
