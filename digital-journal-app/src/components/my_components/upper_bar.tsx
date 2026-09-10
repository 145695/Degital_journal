import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UpperBarProps = {
  title: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
};

export default function UpperBar({
  title,
  onBackPress,
  onMenuPress,
  showBack = true,
  showMenu = true,
}: UpperBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      {showMenu ? (
        <TouchableOpacity onPress={onMenuPress} hitSlop={10}>
          <Ionicons name="ellipsis-vertical" size={20} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#9CAF88', // soft sage green, matching your design
  },
  iconPlaceholder: {
    width: 22, // keeps title centered even when an icon is hidden
  },
});