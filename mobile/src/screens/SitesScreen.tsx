import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Searchbar,
  Chip,
  Surface,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GeologicalSite {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  last_inspection: string;
  sensor_count: number;
  recent_alerts: number;
}

const SitesScreen: React.FC = () => {
  const [sites, setSites] = useState<GeologicalSite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockSites: GeologicalSite[] = [
        {
          id: '1',
          name: 'Mountain Ridge Alpha',
          location: {
            latitude: 40.7128,
            longitude: -74.0060,
            address: 'Rocky Mountain National Park, CO',
          },
          status: 'active',
          risk_level: 'high',
          last_inspection: '2024-01-19T14:30:00Z',
          sensor_count: 12,
          recent_alerts: 3,
        },
        {
          id: '2',
          name: 'Cliff Side Beta',
          location: {
            latitude: 39.5501,
            longitude: -105.7821,
            address: 'Boulder County, CO',
          },
          status: 'active',
          risk_level: 'medium',
          last_inspection: '2024-01-18T09:15:00Z',
          sensor_count: 8,
          recent_alerts: 1,
        },
        {
          id: '3',
          name: 'Quarry Gamma',
          location: {
            latitude: 38.2904,
            longitude: -92.6390,
            address: 'Missouri Quarry District',
          },
          status: 'maintenance',
          risk_level: 'low',
          last_inspection: '2024-01-15T11:45:00Z',
          sensor_count: 6,
          recent_alerts: 0,
        },
        {
          id: '4',
          name: 'Canyon Delta',
          location: {
            latitude: 36.0544,
            longitude: -112.1401,
            address: 'Grand Canyon National Park, AZ',
          },
          status: 'active',
          risk_level: 'critical',
          last_inspection: '2024-01-20T08:00:00Z',
          sensor_count: 15,
          recent_alerts: 7,
        },
      ];
      setSites(mockSites);
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || site.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return '#D32F2F';
      case 'high':
        return '#F57C00';
      case 'medium':
        return '#FFA000';
      case 'low':
        return '#388E3C';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'maintenance':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const renderSiteCard = (site: GeologicalSite) => (
    <Card key={site.id} style={styles.siteCard}>
      <Card.Content>
        <View style={styles.siteHeader}>
          <Title style={styles.siteName}>{site.name}</Title>
          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { borderColor: getStatusColor(site.status) },
              ]}
              textStyle={{ color: getStatusColor(site.status) }}
            >
              {site.status.toUpperCase()}
            </Chip>
            <Chip
              mode="filled"
              style={[
                styles.riskChip,
                { backgroundColor: getRiskColor(site.risk_level) },
              ]}
              textStyle={{ color: '#FFFFFF' }}
            >
              {site.risk_level.toUpperCase()}
            </Chip>
          </View>
        </View>

        <Paragraph style={styles.address}>
          <Icon name="location-on" size={16} color="#757575" />
          {' '}{site.location.address}
        </Paragraph>

        <View style={styles.siteStats}>
          <View style={styles.statItem}>
            <Icon name="sensors" size={20} color="#1565C0" />
            <Paragraph style={styles.statText}>
              {site.sensor_count} Sensors
            </Paragraph>
          </View>
          <View style={styles.statItem}>
            <Icon name="warning" size={20} color="#F57C00" />
            <Paragraph style={styles.statText}>
              {site.recent_alerts} Alerts
            </Paragraph>
          </View>
          <View style={styles.statItem}>
            <Icon name="schedule" size={20} color="#757575" />
            <Paragraph style={styles.statText}>
              {new Date(site.last_inspection).toLocaleDateString()}
            </Paragraph>
          </View>
        </View>

        <View style={styles.siteActions}>
          <Button
            mode="outlined"
            compact
            onPress={() => {}}
            style={styles.actionButton}
          >
            View Details
          </Button>
          <Button
            mode="contained"
            compact
            onPress={() => {}}
            style={styles.actionButton}
          >
            Monitor
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>Geological Sites</Title>
        <Paragraph style={styles.headerSubtitle}>
          {sites.length} sites registered
        </Paragraph>
      </Surface>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search sites..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <Chip
            selected={filterStatus === 'all'}
            onPress={() => setFilterStatus('all')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={filterStatus === 'active'}
            onPress={() => setFilterStatus('active')}
            style={styles.filterChip}
          >
            Active
          </Chip>
          <Chip
            selected={filterStatus === 'inactive'}
            onPress={() => setFilterStatus('inactive')}
            style={styles.filterChip}
          >
            Inactive
          </Chip>
          <Chip
            selected={filterStatus === 'maintenance'}
            onPress={() => setFilterStatus('maintenance')}
            style={styles.filterChip}
          >
            Maintenance
          </Chip>
        </ScrollView>
      </View>

      {/* Sites List */}
      <ScrollView style={styles.sitesContainer}>
        {filteredSites.map(renderSiteCard)}
      </ScrollView>

      {/* FAB for adding new site */}
      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => {}}
        label="Add Site"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  sitesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  siteCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  siteName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 4,
  },
  riskChip: {
    elevation: 2,
  },
  address: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  siteStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#757575',
  },
  siteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1565C0',
  },
});

export default SitesScreen;
