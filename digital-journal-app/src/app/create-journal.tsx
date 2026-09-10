import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createJournal } from '../services/journalStorage';

const PAGE_OPTIONS = [20, 40, 90, 150, 288];
const PAPER_OPTIONS = ['lines', 'dots', 'plain'];
const COVER_OPTIONS = ['burgundy', 'navy', 'black', 'tan', 'green', 'red'];

const COVER_COLORS: Record<string, string> = {
  burgundy: '#7a2e2e',
  navy: '#1f2d4a',
  black: '#222',
  tan: '#c99a5b',
  green: '#8a9a6b',
  red: '#b5342f',
};

// Cycles to the next item in a fixed list, wrapping back to the start at the end
function cycle<T>(options: T[], current: T): T {
  const index = options.indexOf(current);
  return options[(index + 1) % options.length];
}

export default function CreateJournal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [totalPages, setTotalPages] = useState(PAGE_OPTIONS[0]);
  const [paperType, setPaperType] = useState(PAPER_OPTIONS[0]);
  const [cover, setCover] = useState(COVER_OPTIONS[0]);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return; // require a title before creating
    setSaving(true);
    try {
      await createJournal({ title: title.trim(), totalPages, paperType, cover });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>title</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="untitled"
            placeholderTextColor="#bbb"
          />
        </View>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setTotalPages(cycle(PAGE_OPTIONS, totalPages))}
        >
          <Text style={styles.label}>page number</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{totalPages}</Text>
            <Ionicons name="chevron-down" size={14} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setPaperType(cycle(PAPER_OPTIONS, paperType))}
        >
          <Text style={styles.label}>page paper</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{paperType}</Text>
            <Ionicons name="chevron-down" size={14} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setCover(cycle(COVER_OPTIONS, cover))}
        >
          <Text style={styles.label}>cover</Text>
          <View style={[styles.coverSwatch, { backgroundColor: COVER_COLORS[cover] }]} />
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createButton} onPress={handleCreate} disabled={saving}>
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.createText}>{saving ? 'creating...' : 'create'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    color: '#555',
  },
  titleInput: {
    fontSize: 15,
    color: '#7a2e2e',
    textAlign: 'right',
    minWidth: 100,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 15,
    color: '#7a2e2e',
  },
  coverSwatch: {
    width: 40,
    height: 52,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 14,
    color: '#999',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#9CAF88',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  createText: {
    color: '#fff',
    fontSize: 14,
  },
});