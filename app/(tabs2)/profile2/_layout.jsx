import { Stack } from "expo-router";

export default function Profile2Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="refer-earn" options={{ headerShown: false }} />
      <Stack.Screen name="my-wallet" options={{ headerShown: false }} />
      <Stack.Screen name="my-profile" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
    </Stack>
  );
}