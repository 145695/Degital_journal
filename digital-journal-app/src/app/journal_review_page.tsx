import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import UpperBar from '../components/my_components/upper_bar';
import MainBar from '../components/my_components/main_bar';
import { getJournalMetadata } from '../services/journalStorage';

// Same temporary color fallback used on Home, until real cover images exist
const COVER_COLORS: Record<string, string> = {
  burgundy: '#7a2e2e',
  navy: '#1f2d4a',
  black: '#222',
  tan: '#c99a5b',
  green: '#8a9a6b',
  red: '#b5342f',
};

type Journal = {
  id: string;
  title: string;
  cover: string;
  totalPages: number;
  paperType: string;
};

export default function JournalReviewPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [journal, setJournal] = useState<Journal | null>(null);

  const loadJournal = useCallback(async () => {
    if (!id) return;
    const data = await getJournalMetadata(id);
    setJournal(data);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadJournal();
    }, [loadJournal])
  );

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

      <View style={styles.coverWrap}>
        <View
          style={[
            styles.cover,
            { backgroundColor: COVER_COLORS[journal.cover] ?? '#999' },
          ]}
        />
      </View>

      <MainBar
        activeTab="home"
        centerIcon="pencil-outline"
        centerVariant="outline"
        onCenterPress={() =>
          router.push({ pathname: '/writing_page', params: { id: journal.id } })
        }
        onTabPress={(tab) => {
          if (tab === 'home') router.push('/');
          if (tab === 'library') router.push('/library');
          if (tab === 'profile') router.push('/profile');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  cover: {
    width: '100%',
    aspectRatio: 0.72, // matches a portrait book-cover ratio
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});