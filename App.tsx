import * as React from 'react';
import { View, Text, Button, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './app/navigations/Navigation';
import defaultStyles from './app/styles/defaultStyles';
import { AuthProvider } from './app/context/AuthContext';
import { TrainingProvider } from './app/context/TrainingContext';

function App() {

  return (
    <AuthProvider>
      <TrainingProvider>
        <SafeAreaView style={styles.SafeAreaView}>
          <StatusBar backgroundColor={defaultStyles.colors.praimaryColor} />
          <Navigation />
        </SafeAreaView >
      </TrainingProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
});

export default App;