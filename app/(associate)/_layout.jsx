// // app/(associate)/_layout.jsx
// import { Stack } from 'expo-router';

// export default function AssociateLayout() {
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

// app/(associate)/_layout.jsx
import { Stack } from 'expo-router';

export default function AssociateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(tabs2)" />
    </Stack>
  );
}