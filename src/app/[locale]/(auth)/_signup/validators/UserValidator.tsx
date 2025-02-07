import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupStore } from "@/src/zustand/useSignupStore";
 

export function UserValidator() {
  const { userInfo } = useSignupStore();

  const formSchema = z
    .object({
      firstname: z.string().min(1, { message: "Firstname is required" }),
      lastname: z.string().min(1, { message: "Lastname is required" }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
          message: "Password must include uppercase, lowercase, and number",
        }),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: userInfo?.firstname || "",
      lastname: userInfo?.lastname || "",
      email: userInfo?.email || "",
      password: userInfo?.password || "",
      confirmPassword: userInfo?.confirmPassword || "",
    },
  });

  return form;
}
