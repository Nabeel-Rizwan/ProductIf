import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, TouchableOpacity, Linking, StyleSheet, ActivityIndicator, SafeAreaView, Modal, TextInput, Button } from 'react-native';
import fonts from '../app/_layout';
import Jobs from './Germany';


export default function Home_Germany() {
  return (
    <>
    <View style={styles.contentContainer}>
        
      <Jobs />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
  },
})