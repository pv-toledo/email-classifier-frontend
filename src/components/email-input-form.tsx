"use client";

import type React from "react";
import { toast } from "sonner";
import type { MutationInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, UploadCloud, FileText, X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

type EmailInputFormProps = {
  onSubmit: (data: MutationInput) => void;
  isPending: boolean;
  error: Error | null;
};

const formSchema = z
  .object({
    activeTab: z.enum(["text", "file"]),
    emailText: z.string().optional(),
    selectedFile: z.custom<File | null>().optional(),
  })
  .refine(
    (data) => {
      if (data.activeTab === "text") {
        return data.emailText && data.emailText.trim().length > 0;
      }
      return !!data.selectedFile;
    },
    {
      message: "Por favor, preencha o campo ou selecione um arquivo.",
      path: ["emailText"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

export function EmailInputForm({
  onSubmit,
  isPending,
  error,
}: EmailInputFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activeTab: "text",
      emailText: "",
      selectedFile: null,
    },
    mode: "onChange",
  });

  const activeTab = form.watch("activeTab");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "text/csv" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      form.setValue("selectedFile", file, { shouldValidate: true });
    } else {
      toast.error("Por favor, selecione um arquivo .csv ou .xlsx válido.");
    }
  };

  const handleClearFile = () => {
    form.setValue("selectedFile", null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onFormSubmit = (data: FormValues) => {
    if (data.activeTab === "text" && data.emailText) {
      onSubmit({ type: "text", payload: data.emailText });
    } else if (data.activeTab === "file" && data.selectedFile) {
      onSubmit({ type: "file", payload: data.selectedFile });
    }
  };

  return (
    <main className="min-h-screen px-5 flex items-center justify-center lg:px-0">
      <div className="flex mx-auto max-w-2xl w-full">
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ">
          <div className="flex flex-col gap-5 text-center">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Analisador Inteligente de Emails
            </h1>
            <p className="text-muted-foreground lg:text-lg">
              Classifique seus emails e gere respostas automáticas com IA.
            </p>
          </div>
          <Card>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onFormSubmit)}
                  className="space-y-6"
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) =>
                      form.setValue("activeTab", value as "text" | "file")
                    }
                    className="space-y-8"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Email único</TabsTrigger>
                      <TabsTrigger value="file">Arquivo em Lote</TabsTrigger>
                    </TabsList>
                    <div className="h-60">
                      <TabsContent value="text">
                        <FormField
                          control={form.control}
                          name="emailText"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Cole aqui o conteúdo de um e-mail..."
                                  className="h-60 resize-none"
                                  disabled={isPending}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      <TabsContent value="file">
                        <FormField
                          control={form.control}
                          name="selectedFile"
                          render={({ field }) => (
                            <FormItem>
                              {!field.value ? (
                                <FormControl>
                                  <Label
                                    htmlFor="file-upload"
                                    className="flex flex-col gap-4 h-60 p-8 text-center border-2 border-dashed rounded-lg hover:border-primary/50 hover:cursor-pointer"
                                  >
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="text-lg font-medium">
                                      Clique aqui para selecionar um arquivo
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Arquivos .csv ou .xlsx
                                    </p>
                                    <Input
                                      type="file"
                                      accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                      onChange={handleFileChange}
                                      className="hidden"
                                      id="file-upload"
                                      disabled={isPending}
                                    />
                                  </Label>
                                </FormControl>
                              ) : (
                                <div className="flex flex-col justify-between h-60 border-2 border-solid border-primary/20 rounded-lg p-5 bg-primary/5">
                                  <div className="flex items-center justify-between pb-3 border-b border-gray-300">
                                    <div className="flex items-center gap-4">
                                      <div className="p-3 bg-primary/10 rounded-lg">
                                        <FileText className="h-8 w-8 text-primary" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground">
                                          {field.value.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {(field.value.size / 1024).toFixed(1)}{" "}
                                          KB •{" "}
                                          {field.value.type.includes("csv")
                                            ? "CSV"
                                            : "Excel"}
                                        </p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={handleClearFile}
                                      className="text-muted-foreground cursor-pointer hover:text-destructive"
                                      disabled={isPending}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="mt-4 pt-4">
                                    <Label
                                      htmlFor="file-upload-replace"
                                      className="text-sm font-medium text-black cursor-pointer underline"
                                    >
                                      Trocar arquivo
                                    </Label>
                                    <Input
                                      type="file"
                                      accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                      onChange={handleFileChange}
                                      className="hidden"
                                      id="file-upload-replace"
                                      disabled={isPending}
                                    />
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    </div>
                  </Tabs>
                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro na Análise</AlertTitle>
                      <AlertDescription>
                        {error?.message ||
                          "Ocorreu um erro desconhecido. Tente novamente."}
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isPending}
                    className="w-full cursor-pointer"
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Analisando...
                      </>
                    ) : (
                      "Analisar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
