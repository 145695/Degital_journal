import { useMemo, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

type Journal = {
  id: string;
  title: string;
};

type SearchOverlayProps = {
  visible: boolean;
  onClose: () => void;
  journals: Journal[];
  onSelectJournal: (id: string) => void;
};

export default function SearchOverlay({ visible, onClose, journals, onSelectJournal }: SearchOverlayProps) {
  const [query, setQuery] = useState('');

  // Matches if the journal's title contains the typed text or letter, case-insensitive
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return journals.filter((j) => j.title.toLowerCase().includes(q));
  }, [query, journals]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

        <View style={styles.centerWrap} pointerEvents="box-none">
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#999" />
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Search journals..."
              placeholderTextColor="#aaa"
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          {query.length > 0 && (
            <View style={styles.resultsBox}>
              {results.length === 0 ? (
                <Text style={styles.noResults}>No journals match "{query}"</Text>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultRow}
                      onPress={() => {
                        onSelectJournal(item.id);
                        handleClose();
                      }}
                    >
                      <Text style={styles.resultText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  resultsBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 240,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  noResults: {
    padding: 16,
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});