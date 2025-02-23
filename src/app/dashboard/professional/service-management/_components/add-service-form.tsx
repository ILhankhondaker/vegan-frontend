"use client";

// Packages
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";

// Local imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OpacityLoader from "@/components/ui/opacity-loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalService } from "@/types/professional";

const formSchema = z.object({
  serviceName: z
    .string()
    .min(2, "Service name must be at least 2 characters")
    .max(100, "Service name must be less than 100 characters"),
  metaDescription: z
    .string()
    .min(10, "Meta description must be at least 10 characters")
    .max(200, "Meta description must be less than 200 characters"),
  serviceDescription: z
    .string()
    .min(20, "Service description must be at least 20 characters")
    .max(200, "Service description must be less than 200 characters"),
  keyWords: z.array(z.string()),
  paymentType: z.string({
    required_error: "Please select a payment type",
  }),
  sessionType: z.string({
    message: "Please select your session type",
  }),
  isLiveStream: z.boolean(),
  price: z
    .string()
    .optional()
    .transform((val) => (val === "" ? "0.00" : val)),
});

interface Props {
  onOpenChange: (v: boolean) => void;
  initialdata?: ProfessionalService;
}
export default function AddServiceForm({ onOpenChange, initialdata }: Props) {
  const [image, setImage] = useState<File | null | string>(
    initialdata?.serviceImage ?? null,
  );
  const [video, setVideo] = useState<File | null | string>(
    initialdata?.serviceVideo ?? null,
  );

  const session = useSession();
  const queryClient = useQueryClient();

  const userID = session?.data?.user?.userId;

  const { mutate, isPending } = useMutation({
    mutationKey: ["professional-service-create"],
    mutationFn: (data: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/createservice`, {
        method: "POST",
        body: data,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message, {
          position: "top-right",
          richColors: true,
        });
        return;
      }

      // handle success
      form.reset();
      onOpenChange(false);
      toast.success(data.message, {
        position: "top-right",
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["professional-services"] });
    },
  });
  const { mutate: editMutate, isPending: editPending } = useMutation({
    mutationKey: ["professional-service-edit"],
    mutationFn: (data: FormData) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/updateservice/${initialdata?._id}`,
        {
          method: "PUT",
          body: data,
        },
      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message, {
          position: "top-right",
          richColors: true,
        });
        return;
      }

      // handle success
      form.reset();
      onOpenChange(false);
      toast.success(data.message, {
        position: "top-right",
        richColors: true,
      });
      queryClient.invalidateQueries({ queryKey: ["professional-services"] });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyWords: initialdata?.keyWords || [],
      serviceName: initialdata?.serviceName ?? "",
      metaDescription: initialdata?.metaDescription ?? "",
      serviceDescription: initialdata?.serviceDescription ?? "",
      sessionType: initialdata?.sessionType ?? "",
      isLiveStream: initialdata?.isLiveStream ?? undefined,
      paymentType: initialdata?.paymentType ?? undefined,
      price: initialdata?.price.toString() ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userID) {
      toast.warning("userID is missing. Please login again.");
      return;
    }

    const formData = new FormData();

    formData.append("userID", userID);
    formData.append("serviceName", values?.serviceName);
    formData.append("metaDescription", values.metaDescription);
    formData.append("serviceDescription", values.serviceDescription);
    formData.append("keyWords", JSON.stringify(values.keyWords));
    formData.append("paymentType", values.paymentType);
    formData.append("price", values.price!);
    if (image) {
      formData.append("serviceImage", image);
    }
    if (video) {
      formData.append("serviceVideo", video);
    }
    formData.append("sessionType", values.sessionType);
    formData.append("isLiveStream", JSON.stringify(values.isLiveStream));

    // api call

    if (initialdata) {
      editMutate(formData);
    } else {
      mutate(formData);
    }
  }

  const handleFileDrop = (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (type === "image" && file.type.startsWith("image/")) {
      setImage(file);
    } else if (type === "video" && file.type.startsWith("video/")) {
      setVideo(file);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image" && file.type.startsWith("image/")) {
        setImage(file);
      } else if (type === "video" && file.type.startsWith("video/mp4")) {
        setVideo(file);
      }
    }
  };

  const isLoading = isPending || editPending;

  return (
    <div className="relative">
      <OpacityLoader open={isLoading} messsage="Please wait some moment..." />
      <div className="flex items-center justify-between rounded-t-lg bg-white px-[32px] py-[30px] shadow-lg">
        <h4 className="text-xl font-medium leading-[24px] text-[#1F2937]">
          {initialdata ? "Edit Service" : "Add A New Service"}
        </h4>
        <X className="cursor-pointer" onClick={() => onOpenChange(false)} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 overflow-hidden rounded-b-lg bg-white px-[32px] pb-[24px] shadow-lg"
        >
          <div className="">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <div className="flex items-center justify-between pt-6 md:mt-0">
                      <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                        Service Name
                      </FormLabel>
                      <span className="text-lg font-normal leading-[26px] text-[#6B7280]">
                        {field.value?.length || 0}/100
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        className="h-[40px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[705px]"
                        placeholder="E.g Vegan Cooking Classes"
                        {...field}
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className="">
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                      Meta Description
                    </FormLabel>
                    <span className="text-lg font-normal leading-[26px] text-[#6B7280]">
                      {field.value?.length | 0}/200
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="“Write a brief and engaging description that appears in your search results”"
                      className="h-[127px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[705px]"
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="serviceDescription"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                    Service Description
                  </FormLabel>
                  <span className="text-lg font-normal leading-[26px] text-[#6B7280]">
                    {field.value?.length | 0}/200
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="“Describe your service in detail. What service do you offer?”"
                    className="h-[127px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[705px]"
                    {...field}
                    maxLength={200}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="keyWords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Enter your tags"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="isLiveStream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                    Service Type
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl className="h-[40px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[344px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[344px]">
                      <SelectItem value="false">Onsite</SelectItem>
                      <SelectItem value="true">Live</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                    Session Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="h-[40px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[344px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[344px]">
                      {form.watch("isLiveStream") === false && (
                        <>
                          <SelectItem value="Group session">
                            Group Session
                          </SelectItem>
                          <SelectItem value="1-on-1 session">
                            One to One Session
                          </SelectItem>
                        </>
                      )}
                      {form.watch("isLiveStream") === true && (
                        <SelectItem value="Webinar">Webinar</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                    Payment Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="h-[40px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[344px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-[344px]">
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="one-time">One-time Payment</SelectItem>
                      <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("paymentType") !== "free" && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium leading-[26px] text-[#1F2937]">
                      Price ($)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-[40px] w-full border border-[#F3F4F6] bg-[#F9FAFB] px-[16px] py-[12px] outline-none md:w-[344px]"
                        type="number"
                        // step="0.01"
                        min="0"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <Label className="text-base font-medium leading-[26px] text-[#1F2937]">
                Add Image
              </Label>
              <div
                className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors hover:bg-accent/50 ${
                  image ? "border-primary" : "border-muted-foreground/25"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, "image")}
                style={{ height: "160px" }}
              >
                {image ? (
                  <div className="relative">
                    <Image
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image!) || "/placeholder.svg"
                      }
                      width={200}
                      height={200}
                      alt="Preview"
                      className="mx-auto max-h-32 rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2"
                      onClick={() => setImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      Drag and drop an image here or
                    </p>
                    <label className="cursor-pointer text-sm text-primary hover:underline">
                      Click to Upload
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, "image")}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium leading-[26px] text-[#1F2937]">
                Add Video
              </Label>
              <div
                className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors hover:bg-accent/50 ${
                  video ? "border-primary" : "border-muted-foreground/25"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, "video")}
                style={{ height: "160px" }}
              >
                {video ? (
                  <div className="relative">
                    <video
                      src={
                        video && typeof video !== "string"
                          ? URL.createObjectURL(video)
                          : ""
                      }
                      className="mx-auto max-h-32 rounded"
                      controls
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -right-2 -top-2"
                      onClick={() => setVideo(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      Drag and drop a video here or
                    </p>
                    <label className="cursor-pointer text-sm text-primary hover:underline">
                      Click to Upload
                      <input
                        type="file"
                        className="hidden"
                        accept=".mp4"
                        onChange={(e) => handleFileSelect(e, "video")}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-[20px]">
            <Button
              className="w-full md:w-auto"
              size="lg"
              type="submit"
              disabled={isPending}
            >
              {initialdata ? "Save Now" : "Create Service"}
              {isLoading && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
