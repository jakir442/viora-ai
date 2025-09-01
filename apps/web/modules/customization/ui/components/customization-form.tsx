import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-field";
import { widgetSettingsSchema } from "../../schemas";
import { FormSchema } from "../../types";

type WidgetSettings = Doc<"widgetSettings">;

interface CustomizationFormProps {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
}

export const CustomizationForm = ({ initialData, hasVapiPlugin }: CustomizationFormProps) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);

  const form = useForm<FormSchema>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage: initialData?.greetMessage || "Hai! Ada yang bisa saya bantu hari ini?",
      defaultSuggestions: {
        suggestion1: initialData?.defaultSuggestions.suggestion1 || "",
        suggestion2: initialData?.defaultSuggestions.suggestion2 || "",
        suggestion3: initialData?.defaultSuggestions.suggestion3 || "",
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  });

  const onSubmit = async (values: FormSchema) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none" ? "" : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none" ? "" : values.vapiSettings.phoneNumber,
      };

      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defaultSuggestions: values.defaultSuggestions,
        vapiSettings,
      });

      toast.success("Pengaturan widget telah disimpan.");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Obrolan Umum</CardTitle>
            <CardDescription>
              Konfigurasikan perilaku dan pesan dasar widget obrolan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pesan Sapaan</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Pesan selamat datang yang ditampilkan saat obrolan dibuka."
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Pesan pertama yang dilihat pelanggan saat mereka membuka obrolan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />

            <div className="space-y-4">
              <div>
                <h3 className="mb-4 text-sm">Saran Bawaan</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Saran balasan cepat yang ditampilkan kepada pelanggan untuk membantu memandu
                  percakapan
                </p>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saran 1</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="contoh: Bagaimana cara saya memulai?" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saran 2</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="contoh: Apa saja paket harga yang Anda tawarkan?"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saran 3</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="contoh: Saya membutuhkan bantuan dengan akun saya"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Asisten Suara</CardTitle>
              <CardDescription>
                Konfigurasikan fitur panggilan suara yang didukung oleh Vapi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </Form>
  );
};
