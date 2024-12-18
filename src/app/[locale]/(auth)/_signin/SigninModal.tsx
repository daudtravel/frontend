"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import Image from "next/image";
import { LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import img from "@img/images/Batumi.jpg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SigninValidator } from "./SigninValidator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
// import { useAuthStore } from "@/src/zustand/useAuthStore";

export default function SignInModal() {
  const form = SigninValidator();
  const [open, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = searchParams.get("signin");
  // const { setAuth } = useAuthStore();

  const modalCloseClickHandler = () => {
    if (status !== null) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("signin");
      router.replace(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
      setIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modalCloseClickHandler();
      form.reset();
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (status !== null) {
      setIsOpen(true);
    }
  }, [status]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex md:h-[600px] max-w-4xl p-0 border-none md:rounded-md overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        <div className="relative hidden w-1/2 md:block">
          <Image
            src={img}
            alt="Sign in background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-white/80">
              Sign in to continue your journey with us
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between bg-white p-8 md:w-1/2">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Sign in to your account
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please enter your details
            </p>
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
            <Form {...form}>
              <form
                // onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="h-11"
                          onChange={(e) => field.onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          className="h-11"
                          onChange={(e) => field.onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="h-11 w-full text-white mt-4"
                  // onClick={form.handleSubmit(onSubmit)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-6">
            <p className="mt-4 text-center text-sm text-gray-500">
              Don t have an account?
              <button className="font-medium text-gray-900 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
