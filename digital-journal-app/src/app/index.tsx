import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import UpperBar from '../components/my_components/upper_bar';
import MainBar from '../components/my_components/main_bar';
import JournalInformations from '../components/my_components/journal_informations';
import { listJournals } from '../services/journalStorage';

// Temporary color fallback per cover id, until real cover images are added.
// Swap this for a real Image lookup later without touching the rest of this screen.
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

export default function Home() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);

  const loadJournals = useCallback(async () => {
    const result = await listJournals();
    setJournals(result);
  }, []);

  // Reload every time the screen comes back into focus (e.g. after creating a journal)
  useFocusEffect(
    useCallback(() => {
      loadJournals();
    }, [loadJournals])
  );

  const currentJournals = journals.slice(0, 4);
  const allJournals = journals;

  return (
    <View style={styles.screen}>
      <UpperBar title="my little corner" showBack={false} onMenuPress={() => {}} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>current journals</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <FlatList
          data={currentJournals}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.row}
          renderItem={({ item }) => (
            <JournalInformations
              title={item.title}
              coverColor={COVER_COLORS[item.cover] ?? '#999'}
              width={90}
              onPress={() => router.push({ pathname: '/journal_review_page', params: { id: item.id } })}
            />
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All journals</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>

        <View style={styles.grid}>
          {allJournals.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <JournalInformations
                title={item.title}
                coverColor={COVER_COLORS[item.cover] ?? '#999'}
                width={100}
                onPress={() => router.push({ pathname: '/journal_review_page', params: { id: item.id } })}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <MainBar
        activeTab="home"
        centerIcon="add"
        centerVariant="filled"
        onCenterPress={() => router.push('/create-journal')}
        onTabPress={(tab) => {
          if (tab === 'library') router.push('/library');
          if (tab === 'profile') router.push('/profile');
          // search left as a no-op for now
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#222',
  },
  seeAll: {
    fontSize: 13,
    color: '#9CAF88',
  },
  row: {
    gap: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '30%',
  },
});