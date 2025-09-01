import { UseFormReturn } from "react-hook-form";
import { useVapiAssistants, useVapiPhoneNumbers } from "@/modules/plugins/hooks/use-vapi-data";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { FormSchema } from "../../types";

interface vapiFormFieldsProps {
  form: UseFormReturn<FormSchema>;
}

export const VapiFormFields = ({ form }: vapiFormFieldsProps) => {
  const { data: assistants, isLoading: assistantsLoading } = useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } = useVapiPhoneNumbers();

  const disabled = form.formState.isSubmitting;

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asisten Suara</FormLabel>
            <Select
              disabled={assistantsLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={assistantsLoading ? "Loading asisten..." : "Pilih asisten"}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                {assistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Asisten Tanpa Nama"} -{" "}
                    {assistant.model?.model || "Model tidak dikenal"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Asisten Vapi yang digunakan untuk panggilan suara</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tampilkan Nomor Telepon</FormLabel>
            <Select
              disabled={phoneNumbersLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading ? "Loading Nomor Telepon..." : "Pilih Nomor Telepon"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Tidak ada</SelectItem>
                {phoneNumbers.map((phone) => (
                  <SelectItem key={phone.id} value={phone.number || phone.id}>
                    {phone.number || "Tidak dikenal"} - {phone.name || "Tanpa Nama"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Asisten Vapi yang digunakan untuk panggilan suara</FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};
