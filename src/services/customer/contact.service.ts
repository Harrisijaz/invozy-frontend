import axios from "axios";

export type ContactUsRequest = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactUsResponse = {
  message: string;
  devToken?: string | null;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const contactService = {
  async submit(payload: ContactUsRequest) {
    const response = await axios.post<ContactUsResponse>(`${baseUrl}/contact-us`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
};
