import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DataCollectionScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Collection Screen</Text>
      <Text style={styles.subtitle}>Field data collection interface will be implemented here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default DataCollectionScreen;
