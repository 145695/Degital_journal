import { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import UpperBar from '../components/my_components/upper_bar';
import DrawingBar, { DrawingTool } from '../components/my_components/drawing_bar';
import JournalContent from '../components/my_components/journal_content';
import {
  getJournalMetadata,
  getJournalPage,
  writeJournalPage,
} from '../services/journalStorage';

const FONT_OPTIONS = ['System', 'serif', 'monospace'];
const PAPER_OPTIONS: ('lines' | 'dots' | 'plain')[] = ['lines', 'dots', 'plain'];
const COLOR_OPTIONS = ['#333', '#7a2e2e', '#1f2d4a', '#8a9a6b'];
const STICKER_OPTIONS = ['⭐', '❤️', '🌿', '☕'];

type Journal = {
  id: string;
  title: string;
  totalPages: number;
};

export default function WritingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [journal, setJournal] = useState<Journal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageText, setPageText] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [activeTool, setActiveTool] = useState<DrawingTool | null>(null);
  const [font, setFont] = useState(FONT_OPTIONS[0]);
  const [paperStyle, setPaperStyle] = useState<'lines' | 'dots' | 'plain'>(PAPER_OPTIONS[0]);
  const [textColor, setTextColor] = useState(COLOR_OPTIONS[0]);

  // Load journal metadata once, to know its title and total page count
  useEffect(() => {
    if (!id) return;
    getJournalMetadata(id).then(setJournal);
  }, [id]);

  // Load the current page's saved text whenever the page number changes.
  // A non-empty saved page is treated as already-written, so it becomes read-only —
  // this is what enforces the "can't edit a page after saving" rule from the design.
  const loadPage = useCallback(async () => {
    if (!id) return;
    const savedText = await getJournalPage(id, currentPage);
    setPageText(savedText);
    setIsLocked(savedText.length > 0);
  }, [id, currentPage]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleSave = async () => {
    if (!id || isLocked || !pageText.trim()) return;
    await writeJournalPage(id, currentPage, pageText);
    setIsLocked(true);
  };

  const handleSelectTool = (tool: DrawingTool) => {
    setActiveTool(tool === activeTool ? null : tool);
  };

  const handleAddSticker = (sticker: string) => {
    setPageText((prev) => prev + sticker);
  };

  if (!journal) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#9CAF88" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <UpperBar title={journal.title} onBackPress={() => router.back()} />

      <DrawingBar activeTool={activeTool} onSelectTool={handleSelectTool} onSave={handleSave} />

      {/* Inline option row for whichever tool is active */}
      {activeTool === 'pen' && (
        <View style={styles.optionRow}>
          {FONT_OPTIONS.map((f) => (
            <TouchableOpacity key={f} onPress={() => setFont(f)} style={styles.optionChip}>
              <Text style={[styles.optionText, { fontFamily: f }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {activeTool === 'paper' && (
        <View style={styles.optionRow}>
          {PAPER_OPTIONS.map((p) => (
            <TouchableOpacity key={p} onPress={() => setPaperStyle(p)} style={styles.optionChip}>
              <Text style={styles.optionText}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {activeTool === 'color' && (
        <View style={styles.optionRow}>
          {COLOR_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setTextColor(c)}
              style={[styles.colorSwatch, { backgroundColor: c }]}
            />
          ))}
        </View>
      )}
      {activeTool === 'sticker' && (
        <View style={styles.optionRow}>
          {STICKER_OPTIONS.map((s) => (
            <TouchableOpacity key={s} onPress={() => handleAddSticker(s)} style={styles.optionChip}>
              <Text style={styles.stickerText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <JournalContent
        text={pageText}
        onChangeText={setPageText}
        editable={!isLocked}
        fontFamily={font}
        textColor={textColor}
        paperStyle={paperStyle}
      />

      {/* Page navigator — not in the original design, but needed since a journal has multiple pages */}
      <View style={styles.pager}>
        <TouchableOpacity
          disabled={currentPage <= 1}
          onPress={() => setCurrentPage((p) => p - 1)}
        >
          <Ionicons name="chevron-back" size={20} color={currentPage <= 1 ? '#ccc' : '#333'} />
        </TouchableOpacity>

        <Text style={styles.pagerText}>
          page {currentPage} / {journal.totalPages}
        </Text>

        <TouchableOpacity
          disabled={currentPage >= journal.totalPages}
          onPress={() => setCurrentPage((p) => p + 1)}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentPage >= journal.totalPages ? '#ccc' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  optionChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 13,
    color: '#333',
  },
  stickerText: {
    fontSize: 16,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  pager: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  pagerText: {
    fontSize: 13,
    color: '#555',
  },
});