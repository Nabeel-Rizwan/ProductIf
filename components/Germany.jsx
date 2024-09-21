import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, StyleSheet, ActivityIndicator, SafeAreaView, Modal, TextInput, Button } from 'react-native';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [isRemote, setIsRemote] = useState(null);
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const stripHtmlTags = (text) => {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://arbeitnow.com/api/job-board-api');
        const data = await response.json();
        setJobs(data.data);
        setFilteredJobs(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    
    fetchJobs();
  }, []);

  const openJobUrl = (url) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (isRemote !== null) {
      filtered = filtered.filter(job => job.remote === isRemote);
    }

    if (location) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (jobType) {
      filtered = filtered.filter(job => job.job_types.includes(jobType));
    }

    setFilteredJobs(filtered);
    setFilterVisible(false);
  };

  const toggleJobExpansion =  (slug) => {
    if (expandedJob === slug) {
       setExpandedJob(null);
    } else {
       setExpandedJob(slug);
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity activeOpacity={1} style={styles.jobItem}>
      
      <Text style={styles.Post}>Job Title</Text>
      <Text style={styles.jobTitle}>{item.title}</Text>

      <Text style={styles.Post}>Company Name</Text>
      <Text style={styles.jobTitle}>{item.company_name}</Text>

      <Text style={styles.Post}>Location</Text>
      <Text style={styles.jobTitle}>{item.location}</Text>

      {item.job_types.length > 0 && (
        <View style={styles.jobTypeContainer}>
          {item.job_types.map((type, index) => (
            <Text key={index} style={styles.jobType}>{type}</Text>
          ))}
        </View>
      )}

      <View style={styles.remoteContainer}>
        {item.remote ? <Text style={styles.remoteText}>Remote: Yes</Text> : <Text style={styles.remoteText}>Remote: No</Text>}
      </View>

      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => openJobUrl(item.url)}
      >
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>

      {expandedJob === item.slug ? (
        <View style={styles.expandedView}>
          <Text style={styles.Post}>Job Description</Text>
          <Text style={styles.jobDescription}>{stripHtmlTags(item.description)}</Text>
          <TouchableOpacity onPress={() => toggleJobExpansion(item.slug)}>
            <Text style={styles.expandButtonText}>Show Less</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => toggleJobExpansion(item.slug)}>
          <Text style={styles.expandButtonText}>Show More</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0056a0" />
        <Text style={styles.loadingText}>Loading Jobs...</Text>
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
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item.slug}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={filterVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filter Jobs</Text>

          <Text style={styles.modalLabel}>Remote:
          {isRemote === false ? <Text> No</Text> : isRemote === true ? <Text> Yes</Text> : <Text> Any</Text>}
          </Text>

          <View style={styles.filterOption}>
            <TouchableOpacity style={styles.Button} title="Any" onPress={() => setIsRemote(null)} ><Text style={styles.buttonText}>Any</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Button} title="Yes" onPress={() => setIsRemote(true)} ><Text style={styles.buttonText}>Yes</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Button} title="No" onPress={() => setIsRemote(false)} ><Text style={styles.buttonText}>No</Text></TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.modalLabel}>Job Type:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter job type"
            value={jobType}
            onChangeText={setJobType}
          />

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
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

export default App;

const styles = StyleSheet.create({
  
  Button:{
    marginTop:8,
    paddingTop:3,
    paddingBottom:3,
    paddingRight:20,
    paddingLeft:20,
    backgroundColor:'#f4f4f4',
    borderRadius:5,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    paddingBottom: 20,
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
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: 'DMRegular',
    color: 'grey',
    marginBottom: 30,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  jobType: {
    backgroundColor: '#e1e1e1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 8,
    fontSize: 12,
    color: '#333',
  },
  remoteContainer: {
    marginVertical: 8,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0056a0',
    alignItems: 'center',
  },
  remoteText: {
    fontSize: 14,
    color: 'white',
  },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 6,
    alignItems: 'center',
    fontFamily: 'DMRegular',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  expandedView: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  expandButtonText: {
    color: '#0056a0',
    fontSize: 14,
    textAlign: 'center',
    marginTop:20,
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
  filterButton: {
    fontFamily: 'DMRegular',
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
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
    marginTop:20,
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
