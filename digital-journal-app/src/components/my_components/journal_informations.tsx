import { View, Text, Image, ImageSourcePropType, TouchableOpacity, StyleSheet } from 'react-native';

type JournalInformationsProps = {
  title: string;
  cover?: ImageSourcePropType; // e.g. require('../../assets/covers/burgundy.png')
  coverColor?: string; // fallback solid color, used until real cover images exist
  onPress?: () => void;
  width?: number; // lets the list control sizing (e.g. smaller in horizontal scroll rows)
};

export default function JournalInformations({
  title,
  cover,
  coverColor = '#999',
  onPress,
  width = 100,
}: JournalInformationsProps) {
  return (
    <TouchableOpacity style={[styles.container, { width }]} onPress={onPress} activeOpacity={0.8}>
      {cover ? (
        <Image source={cover} style={[styles.cover, { width, height: width * 1.35 }]} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, { width, height: width * 1.35, backgroundColor: coverColor }]} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  cover: {
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3, // Android shadow equivalent
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
  },
});