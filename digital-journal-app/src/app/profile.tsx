import { View, Text, StyleSheet } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.screen}>
      <Text>Profile — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});