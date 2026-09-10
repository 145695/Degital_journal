import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type DrawingTool = 'pen' | 'paper' | 'color' | 'sticker';

type DrawingBarProps = {
  activeTool?: DrawingTool | null;
  onSelectTool?: (tool: DrawingTool) => void;
  onSave?: () => void;
};

const TOOLS: { key: DrawingTool; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'pen', label: 'pen', icon: 'color-wand-outline' }, // controls font, not real drawing
  { key: 'paper', label: 'paper', icon: 'document-outline' }, // controls paper background style
  { key: 'color', label: 'pen color', icon: 'color-palette-outline' }, // controls text color
  { key: 'sticker', label: 'sticker', icon: 'happy-outline' },
];

export default function DrawingBar({ activeTool, onSelectTool, onSave }: DrawingBarProps) {
  return (
    <View style={styles.container}>
      {TOOLS.map((tool) => {
        const isActive = tool.key === activeTool;
        return (
          <TouchableOpacity
            key={tool.key}
            style={styles.item}
            onPress={() => onSelectTool?.(tool.key)}
            hitSlop={6}
          >
            <Ionicons name={tool.icon} size={20} color={isActive ? '#9CAF88' : '#333'} />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tool.label}</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity style={styles.item} onPress={onSave} hitSlop={6}>
        <Ionicons name="save-outline" size={20} color="#333" />
        <Text style={styles.label}>save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#333',
    marginTop: 2,
  },
  labelActive: {
    color: '#9CAF88',
  },
});