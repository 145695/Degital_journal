import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabName = 'home' | 'search' | 'library' | 'profile';

type MainBarProps = {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
  centerIcon: keyof typeof Ionicons.glyphMap; // e.g. 'grid-outline' for create, 'pencil-outline' for write
  centerVariant?: 'filled' | 'outline';
  onCenterPress?: () => void;
};

const TABS: { key: TabName; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'search', label: 'Search', icon: 'search-outline' },
  { key: 'library', label: 'Library', icon: 'book-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

export default function MainBar({
  activeTab,
  onTabPress,
  centerIcon,
  centerVariant = 'outline',
  onCenterPress,
}: MainBarProps) {
  const insets = useSafeAreaInsets();
  const firstHalf = TABS.slice(0, 2);
  const secondHalf = TABS.slice(2);

  const renderTab = (tab: (typeof TABS)[number]) => {
    const isActive = tab.key === activeTab;
    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tab}
        onPress={() => onTabPress?.(tab.key)}
        hitSlop={8}
      >
        <Ionicons name={tab.icon} size={20} color={isActive ? '#9CAF88' : '#333'} />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.side}>{firstHalf.map(renderTab)}</View>

      <TouchableOpacity
        onPress={onCenterPress}
        style={[
          styles.centerButton,
          centerVariant === 'filled' ? styles.centerFilled : styles.centerOutline,
        ]}
      >
        <Ionicons
          name={centerIcon}
          size={20}
          color={centerVariant === 'filled' ? '#fff' : '#9CAF88'}
        />
      </TouchableOpacity>

      <View style={styles.side}>{secondHalf.map(renderTab)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  side: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: '#333',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#9CAF88',
  },
  centerButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerOutline: {
    borderWidth: 1.5,
    borderColor: '#9CAF88',
    backgroundColor: '#fff',
  },
  centerFilled: {
    backgroundColor: '#9CAF88',
  },
});