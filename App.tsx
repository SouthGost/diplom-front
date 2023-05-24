import * as React from 'react';
import { View, KeyboardAvoidingView, Button, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './app/navigations/Navigation';
import defaultStyles from './app/styles/defaultStyles';
import { AuthProvider } from './app/context/AuthContext';

function App() {

  return (
    <AuthProvider>
      {/* <KeyboardAvoidingView> */}
        <SafeAreaView style={styles.SafeAreaView}>
          <StatusBar backgroundColor={defaultStyles.colors.praimaryColor} />
          <Navigation />
        </SafeAreaView >
      {/* </KeyboardAvoidingView> */}
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
  },
});

export default App;