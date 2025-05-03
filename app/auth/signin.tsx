import React, { useState } from "react";
import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "@/components/ui/checkbox";
import { ArrowLeftIcon, CheckIcon, EyeIcon, EyeOffIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Keyboard } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react-native";
import { GoogleIcon } from "@/assets/auth/icons/google";
import { Pressable } from "@/components/ui/pressable";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN } from "@/constants/StorageKeys";
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required"),
  rememberme: z.boolean().optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function SignIn() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const toast = useToast();
  const [validated, setValidated] = useState({
    emailValid: true,
    passwordValid: true,
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRememberMeChange = async (value: boolean) => {
    setRememberMe(value);
    await SecureStore.setItemAsync("rememberme", value.toString());
  };

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const response = await fetch("https://fcs.webservice.odeiapp.fr/auth/login", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok && result.access_token) {
        setValidated({ emailValid: true, passwordValid: true });

        toast.show({
          placement: "bottom right",
          render: ({ id }) => (
            <Toast nativeID={id} variant="solid" action="success">
              <ToastTitle>Logged in successfully!</ToastTitle>
            </Toast>
          ),
        });

        if (data.rememberme) {
          await SecureStore.setItemAsync(ACCESS_TOKEN, result.access_token);
          await SecureStore.setItemAsync("email", data.email);
        }

        reset();
        router.push("/dashboard/home");
      } else {
        setValidated({ emailValid: true, passwordValid: false });
        console.log("Erreur serveur :", result);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      setValidated({ emailValid: false, passwordValid: true });
    }
  };

  const handleState = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <VStack className="w-full" space="md">
      <VStack className="md:items-center" space="md">
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeftIcon} className="md:hidden text-background-800" size="xl" />
        </Pressable>
        <VStack>
          <Heading className="md:text-center" size="3xl">
            Log in
          </Heading>
          <Text>Login to start using fake cloud society app</Text>
        </VStack>
      </VStack>

      <VStack space="xl" className="w-full">
        <FormControl isInvalid={!!errors.email || !validated.emailValid} className="w-full">
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
                  placeholder="Enter email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon as={AlertTriangle} />
            <FormControlErrorText>
              {errors.email?.message || (!validated.emailValid && "Email ID not found")}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isInvalid={!!errors.password || !validated.passwordValid} className="w-full">
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                />
                <InputSlot onPress={handleState} className="pr-3">
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon as={AlertTriangle} />
            <FormControlErrorText>
              {errors.password?.message || (!validated.passwordValid && "Password was incorrect")}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <HStack className="w-full justify-between">
            <Controller
              name="rememberme"
              defaultValue={rememberMe}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  size="sm"
                  value="Remember me"
                  isChecked={value}
                  onChange={(newValue) => {
                    onChange(newValue);
                    handleRememberMeChange(newValue);
                  }}
                  aria-label="Remember me"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Remember me</CheckboxLabel>
                </Checkbox>
              )}
            />
            <Pressable onPress={() => router.replace("/auth/forgot-password")}>
              <LinkText className="font-medium text-sm text-primary-700 group-hover/link:text-primary-600">
                Forgot Password?
              </LinkText>
            </Pressable>
          </HStack>

        <VStack className="w-full my-7" space="lg">
          <Button className="w-full" onPress={handleSubmit(onSubmit)}>
            <ButtonText className="font-medium">Log in</ButtonText>
          </Button>
          <Button variant="outline" action="secondary" className="w-full gap-1" onPress={() => {}}>
            <ButtonText className="font-medium">Continue with Google</ButtonText>
            <ButtonIcon as={GoogleIcon} />
          </Button>
        </VStack>

        <HStack className="self-center" space="sm">
          <Text size="md">Don't have an account?</Text>
          <Pressable onPress={() => router.replace("/auth/signup")}>
            <LinkText className="font-medium text-primary-700" size="md">
              Sign up
            </LinkText>
          </Pressable>
        </HStack>
      </VStack>
    </VStack>
  );
}