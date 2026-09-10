import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-journal" />
        <Stack.Screen name="journal_review_page" />
        <Stack.Screen name="writing_page" />
        <Stack.Screen name="library" />
        <Stack.Screen name="profile" />
      </Stack>
    </ThemeProvider>
  );
}