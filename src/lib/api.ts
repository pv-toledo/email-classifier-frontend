import { env } from "@/env";
import axios from "axios";

export type AIResponse = {
  classification: "Produtivo" | "Improdutivo";
  suggested_response: string;
  original_email?: string;
  error?: string
}

export type MutationInput = {
  type: "text" | "file";
  payload: string | File;
}


export const analyzeEmail = async ({ type, payload }: MutationInput): Promise<AIResponse[]> => {
  const API_BASE_URL = env.NEXT_PUBLIC_API_URL;
  if (!API_BASE_URL) {
    throw new Error("A URL da API não está configurada.");
  }

  if (type === "text") {
    const endpoint = `${API_BASE_URL}/process-single-email`;
    const response = await axios.post<AIResponse>(endpoint, { content: payload });
    return [response.data];
  } else {
    const endpoint = `${API_BASE_URL}/process-batch`;
    const formData = new FormData();
    formData.append("file", payload as File);

    const response = await axios.post<AIResponse[]>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};
