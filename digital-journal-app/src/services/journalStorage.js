import { Directory, File, Paths } from 'expo-file-system';

// Root folder: Documents/Journals
const journalsRootDir = new Directory(Paths.document, 'Journals');

/**
 * Creates a new journal folder with note.txt + metadata.json,
 * based on values the user picked/typed on the create-journal screen.
 *
 * @param {Object} input
 * @param {string} input.title
 * @param {number} input.totalPages   - one of the preset page-count options
 * @param {string} input.paperType    - one of the preset paper-style options
 * @param {string} input.cover        - chosen cover id/color
 * @param {string} [input.noteText]   - initial note content (usually empty at creation)
 */
export async function createJournal({ title, totalPages, paperType, cover }) {
  // 1. Make sure the root "Journals" folder exists (only happens once, ever)
  if (!journalsRootDir.exists) {
    journalsRootDir.create();
  }

  // 2. Give this journal a unique folder name using a timestamp
  const journalId = `journal_${Date.now()}`;
  const journalDir = new Directory(journalsRootDir, journalId);
  journalDir.create();

  // 3. Create one empty page file per page, e.g. page1.txt ... page90.txt
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    const pageFile = new File(journalDir, `page${pageNumber}.txt`);
    pageFile.create();
    await pageFile.write(''); // empty until the user actually writes on it
  }

  // 4. Create metadata.json (the journal's info, built from user input)
  const metadataFile = new File(journalDir, 'metadata.json');
  metadataFile.create();

  const metadata = {
    id: journalId,
    title,
    totalPages,
    paperType,
    cover,
    createdAt: new Date().toISOString(),
  };

  await metadataFile.write(JSON.stringify(metadata, null, 2));

  console.log(`Journal "${title}" created at:`, journalDir.uri);

  // Return the full record so the UI can immediately show it without re-reading from disk
  return metadata;
}

/**
 * Call this once when the app launches (e.g. in App.js's useEffect)
 * if you want the root folder guaranteed to exist at startup,
 * rather than lazily on first journal creation.
 */
export function initStorage() {
  if (!journalsRootDir.exists) {
    journalsRootDir.create();
  }
}

/**
 * Updates a journal's metadata (title, paperType, cover, etc.)
 * Does NOT touch note.txt — that's a separate concern (writing content).
 */
export async function updateJournalMetadata(journalId, updates) {
  const journalDir = new Directory(journalsRootDir, journalId);
  const metadataFile = new File(journalDir, 'metadata.json');

  if (!metadataFile.exists) {
    throw new Error(`Journal "${journalId}" not found`);
  }

  const current = JSON.parse(await metadataFile.text());
  const updated = { ...current, ...updates }; // merge old values with new ones

  await metadataFile.write(JSON.stringify(updated, null, 2));
  return updated;
}

/**
 * Lists all journals by reading each folder's metadata.json
 */
export async function listJournals() {
  if (!journalsRootDir.exists) return [];

  const entries = journalsRootDir.list(); // array of File/Directory instances
  const journals = [];

  for (const entry of entries) {
    // Only look inside subfolders (each journal is its own folder)
    if (entry instanceof Directory) {
      const metadataFile = new File(entry, 'metadata.json');
      if (metadataFile.exists) {
        const content = await metadataFile.text();
        journals.push(JSON.parse(content));
      }
    }
  }

  return journals;
}

/**
 * Reads the content of a single page by its page number (1-indexed)
 */
export async function getJournalPage(journalId, pageNumber) {
  const journalDir = new Directory(journalsRootDir, journalId);
  const pageFile = new File(journalDir, `page${pageNumber}.txt`);
  if (!pageFile.exists) return '';
  return await pageFile.text();
}

/**
 * Writes content to a single page. Call this when the user hits "save"
 * on the writing screen for that specific page.
 */
export async function writeJournalPage(journalId, pageNumber, text) {
  const journalDir = new Directory(journalsRootDir, journalId);
  const pageFile = new File(journalDir, `page${pageNumber}.txt`);
  await pageFile.write(text);
}

/**
 * Deletes a journal folder entirely (folder + note.txt + metadata.json)
 */
export function deleteJournal(journalId) {
  const journalDir = new Directory(journalsRootDir, journalId);
  if (journalDir.exists) {
    journalDir.delete();
  }
}