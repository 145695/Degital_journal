import { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import {
  createJournal,
  listJournals,
  deleteJournal,
  writeJournalPage,
  getJournalPage,
} from './src/services/journalStorage';

export default function App() {
  const [output, setOutput] = useState('Tap a button to test');

  async function handleCreate() {
    const journal = await createJournal({
      title: 'Test Journal',
      totalPages: 5,
      paperType: 'lines',
      cover: 'burgundy',
    });
    setOutput(JSON.stringify(journal, null, 2));
  }

  async function handleList() {
    const journals = await listJournals();
    setOutput(JSON.stringify(journals, null, 2));
  }

  async function handleWritePage() {
    const journals = await listJournals();
    if (journals.length === 0) {
      setOutput('No journals yet — create one first');
      return;
    }
    const first = journals[0];
    await writeJournalPage(first.id, 1, 'Hello, this is page 1!');
    const content = await getJournalPage(first.id, 1);
    setOutput(`Wrote and read back:\n${content}`);
  }

  async function handleDeleteAll() {
    const journals = await listJournals();
    for (const j of journals) {
      deleteJournal(j.id);
    }
    setOutput(`Deleted ${journals.length} journal(s)`);
  }

  return (
    <View style={styles.container}>
      <Button title="Create Test Journal" onPress={handleCreate} />
      <View style={styles.spacer} />
      <Button title="List Journals" onPress={handleList} />
      <View style={styles.spacer} />
      <Button title="Write + Read Page 1" onPress={handleWritePage} />
      <View style={styles.spacer} />
      <Button title="Delete All Journals" onPress={handleDeleteAll} color="red" />
      <ScrollView style={styles.output}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 20 },
  spacer: { height: 10 },
  output: { marginTop: 20, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8 },
  outputText: { fontFamily: 'monospace', fontSize: 12 },
});