import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Linking, Image, TouchableOpacity, Button, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;



const TopCompaniesChart = () => {
  const [job, setJob] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const RedirectAPI=()=>{
    Linking.openURL("http://www.adzuna.co.uk/jobs/salary-predictor.html")
  }


  const fetchTopCompanies = async () => {

    const API_ID=`${process.env.EXPO_PUBLIC_API_ID}`;
     const API_KEY=`${process.env.EXPO_PUBLIC_API_KEY}`;

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(
        `http://api.adzuna.com/v1/api/jobs/gb/top_companies?app_id=${API_ID}&app_key=${API_KEY}&what=${job}&content-type=application/json`
      );
      const result = await response.json();

      // Check if the leaderboard exists in the response
      if (result.leaderboard && result.leaderboard.length > 0) {
        const leaderboard = result.leaderboard.slice(0, 5);

        const labels = leaderboard.map(company => company.canonical_name);
        const values = leaderboard.map(company => company.count);

        setData({
          labels,
          datasets: [{ data: values }]
        });
      } else {
        setErrorMessage('No data available for the specified job.');
      }
    } catch (error) {
      setErrorMessage('Error fetching data. Please try again.');
      console.error('Error fetching data:', error);
    }
    setLoading(false);
    setJob('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <Text style={styles.Title}>Top 5 companies hiring a talent in the UK, <Text style={styles.blue}>Get Insights</Text></Text>

      <TextInput
        style={styles.input}
        placeholder="Enter job title"
        value={job}
        onChangeText={setJob}
      />
      <View style={styles.button}>
      <Button title="Get Top Companies" onPress={fetchTopCompanies} />
      </View>

      {loading &&  <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0056a0" />
        <Text style={styles.loadingText}>Loading Jobs...</Text>
      </View>}
      
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {data && (
        <ScrollView
          horizontal
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.chartWrapper}>
            <BarChart
              data={data}
              width={screenWidth * 2}
              height={300}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              style={styles.chart}
            />
          </View>
        </ScrollView>
      )}

<View style={styles.logoContainer}>
<Image style={styles.logo}
source={{uri:'https://zunastatic-abf.kxcdn.com/images/global/landing/press/logo_stacked.png'}}
/>
<TouchableOpacity onPress={RedirectAPI}>
<Text style={styles.logoText}>Powered by Adzuna Jobsworth</Text>
</TouchableOpacity>
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logoText:{
    fontFamily:"DMRegular",
    marginTop:2,
    marginBottom:10,
    },
    logoContainer:{
        marginTop:50,
        
    },
    logo:{
        width:70,
        height:70,
        resizeMode:'contain',
    },  
  blue:{
    color:"#0056a0",
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      loadingText: {
        fontSize: 18,
        color: '#0056a0',
        marginTop: 10,
      },
    button:{
        fontFamily:"DMRegular",
        padding:10,
    },
    Title: {
        fontSize: 28,
        fontFamily: 'DMRegular',
        color: 'grey',
        marginVertical:30,
      },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  chartWrapper: {
    marginTop:50,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    flexGrow: 1,
  },
  chart: {
    borderRadius: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TopCompaniesChart;
