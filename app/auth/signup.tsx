import React, { useState } from "react";
import { useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { Icon, ArrowLeftIcon, CheckIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Keyboard } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { GoogleIcon } from "@/assets/auth/icons/google";


const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email(),
    password: z
      .string()
      .min(6, "Must be at least 6 chars")
      .regex(/.*[A-Z].*/, "One uppercase")
      .regex(/.*[a-z].*/, "One lowercase")
      .regex(/.*\d.*/, "One number")
      .regex(/.*[`~<>?,.\/!@#$%^&*()\-_+=\"'|{}\[\];:\\\\].*/, "One special char"),
    confirmpassword: z.string(),
    FirstName: z.string().min(1, "First name is required"),
    LastName: z.string().min(1, "Last name is required"),
    country: z.string().min(1, "Country is required"),
    acceptTerms: z.boolean().refine(v => v, "You must accept the terms"),
  })
  .refine(data => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords must match",
  });


type SignUpSchemaType = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      const res = await fetch("https://fcs.webservice.odeiapp.fr/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.FirstName,
          lastName: data.LastName,
          country: data.country,
        }),
      });
  
      const result = await res.json();
  
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action={res.ok ? "success" : "error"}>
            <ToastTitle>{res.ok ? "Account created!" : result.message || "Sign up failed"}</ToastTitle>
          </Toast>
        ),
      });
  
      if (res.ok) {
        reset();
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.show({
        placement: "bottom right",
        render: ({ id }) => (
          <Toast nativeID={id} variant="solid" action="error">
            <ToastTitle>Sign up failed</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  const togglePw = () => setShowPassword(v => !v);
  const toggleCp = () => setShowConfirm(v => !v);
  const onEnter = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="w-full" space="md">
      <VStack className="md:items-center" space="md">
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeftIcon} size="xl" className="md:hidden" />
        </Pressable>
        <Heading size="3xl">Sign up</Heading>
        <Text>Sign up and start using fake cloud society app</Text>
      </VStack>

      {/* Email */}
      <FormControl isInvalid={!!errors.email}>
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* First Name */}
      <FormControl isInvalid={!!errors.FirstName}>
        <FormControlLabel>
          <FormControlLabelText>First Name</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="FirstName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="First Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.FirstName?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Last Name */}
      <FormControl isInvalid={!!errors.LastName}>
        <FormControlLabel>
          <FormControlLabelText>Last Name</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="LastName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Last Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.LastName?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* country */}
      <FormControl isInvalid={!!errors.country}>
        <FormControlLabel>
          <FormControlLabelText>country</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="country"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="country"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.country?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Password */}
      <FormControl isInvalid={!!errors.password}>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
              <InputSlot onPress={togglePw} className="pr-3">
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.password?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Confirm Password */}
      <FormControl isInvalid={!!errors.confirmpassword}>
        <FormControlLabel>
          <FormControlLabelText>Confirm Password</FormControlLabelText>
        </FormControlLabel>
        <Controller
          name="confirmpassword"
          control={control}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onEnter}
                returnKeyType="done"
              />
              <InputSlot onPress={toggleCp} className="pr-3">
                <InputIcon as={showConfirm ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertTriangle} />
          <FormControlErrorText>{errors.confirmpassword?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {/* Accept terms */}
      <HStack className="w-full">
        <Controller
          name="acceptTerms"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <Checkbox isChecked={value} onChange={onChange} accessibilityLabel="Accept terms" value={""}>
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>I accept Terms of Use & Privacy</CheckboxLabel>
            </Checkbox>
          )}
        />
      </HStack>

      {/* Actions */}
      <VStack className="w-full my-7" space="lg">
        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <ButtonText>Sign up</ButtonText>
        </Button>
        <Button variant="outline" action="secondary" className="w-full gap-1">
          <ButtonText>Continue with Google</ButtonText>
          <ButtonIcon as={GoogleIcon} />
        </Button>
      </VStack>

      <HStack className="self-center" space="sm">
        <Text>Already have an account?</Text>
        <Pressable onPress={() => router.push("/auth/signin")}>
          <LinkText className="text-primary-700">Login</LinkText>
        </Pressable>
      </HStack>
    </VStack>
  );
}
