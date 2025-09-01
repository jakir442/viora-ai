import z from "zod";

export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Pesan sapaan wajib diisi."),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});
