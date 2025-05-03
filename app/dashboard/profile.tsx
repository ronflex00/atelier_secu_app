import React from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ScrollView } from "@/components/ui/scroll-view";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Divider } from "@/components/ui/divider";
import { Avatar, AvatarImage, AvatarBadge } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useSession } from "@/components/ctx";
import { StorageKeys } from "@/constants/StorageKeys";

export default function Profile() {
  const router = useRouter();
  const { signOut, session } = useSession();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(StorageKeys.ACCESS_TOKEN);
    signOut();
    router.replace("/");
  };

  return (
    <VStack className="flex-1 bg-background-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <VStack className="items-center mb-8" space="md">
          <Avatar size="2xl" className="bg-primary-600">
            <AvatarImage
              source={require("@/assets/profile/image.png")}
              alt="Avatar"
            />
            <AvatarBadge />
          </Avatar>
          <Heading size="xl">
            {session.firstName} {session.lastName}
          </Heading>
          <Text className="text-typography-600">{session.country}</Text>
        </VStack>

        <HStack className="justify-around mb-8">
          {[
            { label: "Friends", value: "45K" },
            { label: "Followers", value: "500M" },
            { label: "Rewards", value: "40" },
            { label: "Posts", value: "346" },
          ].map(({ label, value }) => (
            <VStack key={label} className="items-center">
              <Text className="font-semibold">{value}</Text>
              <Text className="text-xs text-typography-600">{label}</Text>
            </VStack>
          ))}
        </HStack>

        <Divider />

        <VStack space="sm" className="mt-6">
          <Heading size="lg">Compte</Heading>
          {["Paramètres", "Notifications", "Récompenses"].map(title => (
            <Button key={title} variant="link" className="justify-between">
              <Text>{title}</Text>
            </Button>
          ))}
        </VStack>

        <Divider className="my-6" />

        <VStack space="sm">
          <Heading size="lg">Préférences</Heading>
          {["Langue", "Apparence", "Confidentialité"].map(title => (
            <Button key={title} variant="link" className="justify-between">
              <Text>{title}</Text>
            </Button>
          ))}
        </VStack>

        <VStack className="mt-12">
          <Button
            variant="outline"
            action="secondary"
            className="w-full"
            onPress={handleLogout}
          >
            <ButtonText>Se déconnecter</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
