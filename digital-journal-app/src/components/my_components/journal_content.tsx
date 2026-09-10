import { useState } from 'react';
import { TextInput, View, StyleSheet, LayoutChangeEvent } from 'react-native';

type JournalContentProps = {
  text: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  fontFamily?: string;
  textColor?: string;
  paperStyle?: 'lines' | 'dots' | 'plain';
};

const LINE_HEIGHT = 24;
const DOT_SPACING = 22;

const PAPER_BACKGROUNDS: Record<string, string> = {
  lines: '#fdfcf7',
  dots: '#fbfbf5',
  plain: '#ffffff',
};

// Renders horizontal ruled lines spaced to match the text's line height
function LinesPattern({ width, height }: { width: number; height: number }) {
  const rowCount = Math.ceil(height / LINE_HEIGHT);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: rowCount }).map((_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            top: (i + 1) * LINE_HEIGHT,
            left: 0,
            width,
            height: 1,
            backgroundColor: '#dcd7c8',
          }}
        />
      ))}
    </View>
  );
}

// Renders a grid of small dots, like dot-grid notebook paper
function DotsPattern({ width, height }: { width: number; height: number }) {
  const cols = Math.ceil(width / DOT_SPACING);
  const rows = Math.ceil(height / DOT_SPACING);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <View
            key={`${r}-${c}`}
            style={{
              position: 'absolute',
              top: r * DOT_SPACING,
              left: c * DOT_SPACING,
              width: 2,
              height: 2,
              borderRadius: 1,
              backgroundColor: '#cfc9b8',
            }}
          />
        ))
      )}
    </View>
  );
}

export default function JournalContent({
  text,
  onChangeText,
  editable = true,
  fontFamily = 'System',
  textColor = '#333',
  paperStyle = 'plain',
}: JournalContentProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View
      style={[styles.page, { backgroundColor: PAPER_BACKGROUNDS[paperStyle] }]}
      onLayout={handleLayout}
    >
      {paperStyle === 'lines' && size.height > 0 && (
        <LinesPattern width={size.width} height={size.height} />
      )}
      {paperStyle === 'dots' && size.height > 0 && (
        <DotsPattern width={size.width} height={size.height} />
      )}

      <TextInput
        style={[
          styles.input,
          { fontFamily, color: textColor },
          paperStyle === 'lines' && { lineHeight: LINE_HEIGHT },
        ]}
        multiline
        value={text}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={editable ? 'Start writing...' : ''}
        placeholderTextColor="#bbb"
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    margin: 16,
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    flex: 1,
    padding: 20,
    fontSize: 15,
    lineHeight: 22,
  },
});