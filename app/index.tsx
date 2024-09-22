
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Stack } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import UK from '../components/UK';
import Germany from '../components/Home_Germany';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../app/Home';
import UK_Statistics from '../components/UK_Statistics';
import US_Statistics from '../components/US_Statistics';
import US from '../components/US';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Germany_Statistics from '../components/Germany_Statistics';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const Index = () => {

  return (
    <>

      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: 'white',
          },
          headerTitle: 'Productif',
          headerTitleAlign: 'center', 
          headerTitleStyle: {
            fontSize: 22, 
            color: 'grey',
            fontFamily: 'DMRegular',
          },
        }}
      />
      
<Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="UK Jobs" component={UK} />
      <Drawer.Screen name="Top UK Companies Hiring" component={UK_Statistics} />
      <Drawer.Screen name="Germany Jobs" component={Germany} />
      <Drawer.Screen name="Top Germany Companies Hiring" component={Germany_Statistics} />
      <Drawer.Screen name="US Jobs" component={US} />
      <Drawer.Screen name="Top US Companies Hiring" component={US_Statistics} />
</Drawer.Navigator>



    </>
  );
};

export default Index;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
  },
    listContainer: {
      paddingBottom: 20,
    },
    jobItem: {
      backgroundColor: '#ffffff',
      padding: 15,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 5,
      elevation: 2,
    },
    jobTitle: {
      fontSize: 18,
    },
    jobCompany: {
      fontSize: 14,
      color: '#666',
      marginTop: 5,
    },
    jobLocation: {
      fontSize: 12,
      color: '#333',
      marginTop: 5,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  