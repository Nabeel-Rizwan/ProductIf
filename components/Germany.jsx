import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, Modal, Button, SafeAreaView } from 'react-native';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [page, setPage] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      setError(null);

      const API_ID=`${process.env.EXPO_PUBLIC_API_ID}`;
      const API_KEY=`${process.env.EXPO_PUBLIC_API_KEY}`;
      
      const response = await axios.get(`http://api.adzuna.com/v1/api/jobs/de/search/${page}`, {
        params: {
          app_id: API_ID,
          app_key: API_KEY,
          results_per_page: 20,
          what: searchTerm,
          where: locationFilter,
          'content-type': 'application/json',
        },
      });

      const jobsData = response.data.results;

      if (isLoadMore) {
        setJobs((prevJobs) => [...prevJobs, ...jobsData]);
        setFilteredJobs((prevJobs) => [...prevJobs, ...jobsData]);
      } else {
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      }

      if (jobsData.length < 20) setIsMore(false);

    } catch (err) {
      setError(err.message || 'Error fetching jobs');
    } finally {
      if (!isLoadMore) setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilter = () => {
    setPage(1);
    setIsMore(true);
    setJobs([]);
    setFilteredJobs([]);
    fetchJobs();
    setFilterVisible(false);
  };

  const handleShowMore = () => {
    setLoadingMore(true);
    setPage(page + 1);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleJobPress = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const API_Redirect=()=>{
    Linking.openURL('http://www.adzuna.co.uk');
  }

  const toggleExpand = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  if (loading && page === 1) {
    return(
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0056a0" />
        <Text style={styles.loadingText}>Loading Jobs...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View>
        <Text>Error fetching jobs: {error}</Text>
        <TouchableOpacity onPress={fetchJobs}>Reload</TouchableOpacity>
      </View>
    );
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        <Text style={styles.filterText}>Filter Jobs</Text>
      </TouchableOpacity>

      <FlatList
        ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.Post}>Job Title</Text>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.Post}>Company Name</Text>
            <Text style={styles.jobTitle}>{item.company.display_name}</Text>
            <Text style={styles.Post}>Location</Text>
            <Text style={styles.jobTitle}>{item.location.display_name}</Text>
            <Text style={styles.Post}>Salary</Text>
            <Text style={styles.jobTitle}>
              {item.salary_min ? `${item.salary_min} - ${item.salary_max}` : 'Not specified'}
            </Text>

          <View style={styles.logoContainer}>
          <TouchableOpacity onPress={API_Redirect}><Text style={styles.LogoText}>Jobs by</Text></TouchableOpacity>
         
          <Image style={styles.tinyLogo} source={{
          uri: 'https://zunastatic-abf.kxcdn.com/images/global/landing/press/logo_normal.png',
        }} />
        </View>

            {expandedItems[item.id] ? (
              <View style={styles.expandedView}>
                <Text style={styles.Post}>Job Description</Text>
                <Text style={styles.jobDescription}>{item.description}</Text>
                <TouchableOpacity
                  style={styles.expandButton}
                  onPress={() => toggleExpand(item.id)}
                >
                  <Text style={styles.expandButtonText}>Show Less</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleExpand(item.id)}
              >
                <Text style={styles.expandButtonText}>Show More</Text>
              </TouchableOpacity>
            )}


            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => handleJobPress(item.redirect_url)}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>

            

          </View>
        )}
        ListFooterComponent={() =>
          isMore && (
            <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
              {loadingMore ? (
                <ActivityIndicator size="small" color="#0056a0" />
              ) : (
                <Text style={styles.white}>Next</Text>
              )}
            </TouchableOpacity>
          )
        }
      />

      <Modal
        visible={filterVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filter Jobs</Text>
          <Text style={styles.modalLabel}>Job Title:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job title"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <Text style={styles.modalLabel}>Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={locationFilter}
            onChangeText={setLocationFilter}
          />
          <Text style={styles.modalLabel}>Min Salary:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter min salary"
            value={minSalary}
            onChangeText={setMinSalary}
            keyboardType="numeric"
          />
          <Text style={styles.modalLabel}>Max Salary:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter max salary"
            value={maxSalary}
            onChangeText={setMaxSalary}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.applyButton} onPress={handleFilter}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

logoContainer:{
  marginTop:20,
  flexDirection: 'row',
},

LogoText: {
  fontSize: 14,
  fontFamily: 'DMRegular',
  color: '#333',
  marginBottom: 10,
},

white:{
  color:'white',
  fontFamily:"DMRegular",
},

  tinyLogo:{
    marginTop:10,
    width: 116, 
    height: 23,
    resizeMode:'cover', 
    marginLeft:10,
    marginRight:10,
    marginBottom:30,
  },
  
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f4f4f4',
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
  jobItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  Post: {
    fontSize: 17,
    fontFamily: 'DMRegular',
    color: '#333',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: 'DMRegular',
    color: 'grey',
    marginBottom: 15,
  },
  jobDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  expandButton: {
    backgroundColor: '#0056a0',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  expandButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily:"DMRegular",
    color: '#fff',
    fontSize: 16,
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
  filterText: {
    color: '#fff',
    fontSize: 16,
  },
  showMoreButton: {
    margin:20,
    padding: 10,
    backgroundColor: '#0056a0',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobList;
