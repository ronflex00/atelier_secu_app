import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useSession } from "@/components/ctx";
import { StorageKeys } from "@/constants/StorageKeys";

export default function Index() {
  const router = useRouter();
  const { signIn } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(StorageKeys.ACCESS_TOKEN).then(token => {
      if (token) {
        router.replace("/dashboard/home");
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn();
      const token = await SecureStore.getItemAsync(StorageKeys.ACCESS_TOKEN);
      if (token) {
        router.replace("/dashboard/home");
      }
    } catch (err) {
      console.error("Connexion échouée", err);
    }
  };

  if (loading) return null; // ou un loader

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <HStack className="flex-1">
          <VStack className="hidden md:flex flex-1 items-center justify-center">
            <Image
              source={require("@/assets/auth/radialGradient.png")}
              height={200}
              width={200}
              alt="Background Gradient"
            />
          </VStack>
          <VStack
            className="flex-1 px-6 py-12 max-w-lg mx-auto justify-center"
            space="lg"
          >
            <VStack className="items-center" space="sm">
              <Heading size="3xl" className="text-center">
                Fake Cloud Society
              </Heading>
              <Text className="text-center text-typography-600">
                Bienvenue sur notre application
              </Text>
            </VStack>
            <VStack space="md" className="w-full">
              <Button onPress={handleSignIn} className="w-full">
                <ButtonText>Se connecter</ButtonText>
              </Button>
              <Button
                variant="outline"
                onPress={() => router.push("/auth/signup")}
                className="w-full"
              >
                <ButtonText>Créer un compte</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </HStack>
      </ScrollView>
    </SafeAreaView>
  );
}
