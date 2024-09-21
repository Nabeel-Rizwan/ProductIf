import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, SafeAreaView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Easing } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, src: require('../assets/images/UK.jpg'), label: 'Unlock Career Opportunities in the UK', screen: 'UK Jobs' },
  { id: 2, src: require('../assets/images/US.jpg'), label: 'Discover Your Next Big Opportunity in the USA', screen: 'US Jobs' },
  { id: 3, src: require('../assets/images/Chart.jpg'), label: 'Find the Top Companies Hiring for a Job Role', screen: 'Top US Companies Hiring' },
  { id: 4, src: require('../assets/images/Germany.jpg'), label: 'Discover Exciting Opportunities in Germany', screen: 'Germany Jobs' },
  { id: 5, src: require('../assets/images/Lock.jpg'), label: 'The App Does Not Collect User Data', screen: 'Home' },
];

const jobTitles = [
  'Marketing Manager',
  'Software Developer',
  'Engineer',
  'Nurse',
  'Operator',
  'Data Analyst',
  'Project Manager',
  'UX Designer',
  'Driver',
  'Mechanical Engineer',
  'Manager',
  'Accountant',
  'Chief',
];

export default function Home({ navigation }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (activeIndex + 1) % images.length;
      scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 3000); // Automatically slide every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const onScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const jobTitleWidth = width * 0.5; // Width of each job title container
    const totalWidth = jobTitleWidth * jobTitles.length; // Total width of all job titles

    const startScrolling = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -totalWidth,
            duration: 50000,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(scrollX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startScrolling(); // Start scrolling on mount
  }, []);

  const handleImagePress = (image) => {
    if (image.screen) {
      navigation.navigate(image.screen);
    } else {
      alert('This image does not navigate to any screen.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.sliderContainer}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          {jobTitles.concat(jobTitles).map((title, index) => (
            <View key={index} style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{title}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      <ScrollView>
        <Text style={styles.title}>
          Get Your <Text style={styles.blue}>Dream Job</Text>
        </Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ref={scrollViewRef}
        >
          {images.map((image) => (
            <TouchableOpacity key={image.id} onPress={() => handleImagePress(image)} style={styles.slide}>
              <Image source={image.src} style={styles.image} />
              <Text style={styles.label}>{image.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.description}>
          Welcome to your ultimate job search companion, designed to connect you with the best opportunities in the <Text style={styles.blue}>UK, Germany, and the USA</Text>.
        </Text>

        <Text style={styles.description}>
          We provide a streamlined and intuitive experience to help you secure the perfect job that aligns with your skills and aspirations. There is <Text style={styles.blue}>no Sign up or Sign in</Text> to filter and find a good job for yourself saving time.
        </Text>

        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/World.jpg')} style={styles.image} />
        </View>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Germany Jobs')}>
            <Text style={styles.white}>Germany Jobs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('UK Jobs')}>
            <Text style={styles.white}>UK Jobs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('US Jobs')}>
            <Text style={styles.white}>US Jobs</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          There are multiple jobs collected in this one platform with filtering options allowing you to find the best job according to your requirements.
        </Text>

        <Text style={styles.title}>Get <Text style={styles.title2}>Useful Insights</Text></Text>

        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/Research.jpg')} style={styles.image2} />
        </View>

        <Text style={styles.description}>
          Discover the <Text style={styles.blue}>top companies hiring</Text> for your desired talent to make more informed career decisions.
        </Text>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Top UK Companies Hiring')}>
            <Text style={styles.white}>UK Companies Hiring A Talent</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Top Germany Companies Hiring')}>
            <Text style={styles.white}>Germany Companies Hiring A Talent</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.margins}>
          <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Top US Companies Hiring')}>
            <Text style={styles.white}>US Companies Hiring A Talent</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacy_container}>
          <Image source={require('../assets/images/Privacy.webp')} style={styles.privacy} />
          <Text style={styles.disclaimer}>The app does not store or share your data</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  label:{
    marginBottom:30,
    marginRight:5,
    marginLeft:5,
    color:"white",
    fontSize:16,
    backgroundColor:'#0056a0',
    paddingTop:5,
    paddingBottom:10,
    paddingRight:20,
    paddingLeft:20,
    borderRadius:10,
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 230,
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  disclaimer:{
        alignItems:'center',
        justifyContent:'center',
        marginTop:40,
        color:'#0056a0'
    },
    privacy_container:{
    flexDirection: 'row'
    },
    privacy:{
        height:50,
        width:50,
        margin:20,
    },
  blue: {
    color: "#0056a0",
  },
  sliderContainer: {
    height: 50,
    backgroundColor: '#0056a0',
    overflow: 'hidden', 
    justifyContent: 'center',
    marginVertical: 0,
  },
  animatedView: {
    flexDirection: 'row',
  },
  jobTitleContainer: {
    width: width * 0.8, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily:"DMRegular",
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image2: {
    resizeMode: 'cover',
    width: '90%',  
    height: 220,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  title2: {
    margin: 20,
    color: "#0056a0",
    fontFamily: "DMRegular",
    fontSize: 24,
  },
  white: {
    color: "white",
    fontFamily: "DMRegular",
  },
  filterButton: {
    backgroundColor: '#0056a0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: '90%',
    height: 220,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    color: 'grey',
    fontFamily: "DMRegular",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#808080',
  },
  margins: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
