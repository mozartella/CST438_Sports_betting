// Index.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Button from '@/components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navagation/types'; // Import navigation types

const PlaceholderImage = require('@/assets/images/Placeholder.jpg');

// Define the type for the navigation prop
type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Index = () => {
  const navigation = useNavigation<IndexScreenNavigationProp>(); // Use the typed navigation hook

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount'); // Now TypeScript knows the 'CreateAccount' screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={PlaceholderImage}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Login" />
        <Button label="Create Account" onPress={handleCreateAccount} />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: width * 0.95,
    height: height * 0.5,
    borderRadius: 18,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});

export default Index;
