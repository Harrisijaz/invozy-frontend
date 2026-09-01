"use client";

import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/common/toast";
import { Button } from "@/components/ui/button";
import { contactService } from "@/src/services/customer/contact.service";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";

const initialForm = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

export function ContactForm() {
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.topic.trim() || !form.message.trim()) {
      toast("Please complete all contact form fields.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const response = await contactService.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim(),
      });
      toast(response.message || "Message submitted.", "success");
      setForm(initialForm);
    } catch (error) {
      toast(getCustomerApiErrorMessage(error, "Unable to submit your message. Please try again."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-5 grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Full name
          <input
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-foreground">
          Email address
          <input
            type="email"
            className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
            placeholder="you@company.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-foreground">
        Topic
        <select
          className="min-h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          value={form.topic}
          onChange={(event) => updateField("topic", event.target.value)}
        >
          <option value="" disabled>Select a topic</option>
          <option>Account setup</option>
          <option>Billing</option>
          <option>Invoices and quotations</option>
          <option>Technical support</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-foreground">
        Message
        <textarea
          className="min-h-32 resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          placeholder="Write your message..."
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>
      <div className="grid gap-3 border-t border-border pt-5 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">For active customers, include your account email.</p>
        <Button type="submit" className="group w-full sm:w-auto" isLoading={submitting}>
          Submit Message <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </form>
  );
}
