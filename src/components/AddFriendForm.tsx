"use client";

import { addFriendValidator } from "@/lib/validators/add-friend";
import Button from "./ui/Button";
import axios from "axios";
import { useState } from "react";
import z from "zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendForm = () => {
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    setShowSuccessState(false);
    setIsSending(true);
    try {
      const validateEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validateEmail,
      });

      setShowSuccessState(true);
    } catch (error) {
      setShowSuccessState(false);
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        return;
      }
      setError("email", { message: "Something went wrong" });
    } finally {
      setIsSending(false);
      setValue("email", "");
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by E-mail
      </label>

      <div className="mt-2 flex items-center gap-4">
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className="block w-full  rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-light sm:tex-sm  sm:leading-6"
        />
        <Button isLoading={isSending} type="submit">
          Add
        </Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>

      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">Friend request send!</p>
      ) : null}
    </form>
  );
};

export default AddFriendForm;
