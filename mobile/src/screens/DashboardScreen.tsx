import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Chip,
  Portal,
  Modal,
} from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../services/AuthContext';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalAlerts: number;
  criticalAlerts: number;
  recentPredictions: number;
  systemHealth: number;
}

interface RecentAlert {
  id: string;
  site_name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSites: 0,
    activeSites: 0,
    totalAlerts: 0,
    criticalAlerts: 0,
    recentPredictions: 0,
    systemHealth: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API calls
      setStats({
        totalSites: 15,
        activeSites: 12,
        totalAlerts: 8,
        criticalAlerts: 2,
        recentPredictions: 45,
        systemHealth: 94,
      });

      setRecentAlerts([
        {
          id: '1',
          site_name: 'Site Alpha',
          severity: 'critical',
          message: 'High risk rockfall detected',
          timestamp: '2024-01-20T10:30:00Z',
        },
        {
          id: '2',
          site_name: 'Site Beta',
          severity: 'high',
          message: 'Unusual seismic activity',
          timestamp: '2024-01-20T09:15:00Z',
        },
        {
          id: '3',
          site_name: 'Site Gamma',
          severity: 'medium',
          message: 'Weather conditions warning',
          timestamp: '2024-01-20T08:45:00Z',
        },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const chartData = {
    labels: ['Sites', 'Sensors', 'Predictions'],
    datasets: [
      {
        data: [stats.activeSites, 48, stats.recentPredictions],
        color: (opacity = 1) => `rgba(21, 101, 192, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieData = [
    {
      name: 'Active',
      population: stats.activeSites,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Inactive',
      population: stats.totalSites - stats.activeSites,
      color: '#F44336',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>
          Welcome, {user?.username || 'User'}
        </Title>
        <Paragraph style={styles.headerSubtitle}>
          Rockfall Prediction Dashboard
        </Paragraph>
      </Surface>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, styles.primaryCard]}>
          <Card.Content style={styles.statContent}>
            <Icon name="terrain" size={32} color="#FFFFFF" />
            <Title style={styles.statNumber}>{stats.totalSites}</Title>
            <Paragraph style={styles.statLabel}>Total Sites</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.successCard]}>
          <Card.Content style={styles.statContent}>
            <Icon name="check-circle" size={32} color="#FFFFFF" />
            <Title style={styles.statNumber}>{stats.activeSites}</Title>
            <Paragraph style={styles.statLabel}>Active Sites</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.warningCard]}>
          <Card.Content style={styles.statContent}>
            <Icon name="warning" size={32} color="#FFFFFF" />
            <Title style={styles.statNumber}>{stats.totalAlerts}</Title>
            <Paragraph style={styles.statLabel}>Active Alerts</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.errorCard]}>
          <Card.Content style={styles.statContent}>
            <Icon name="priority-high" size={32} color="#FFFFFF" />
            <Title style={styles.statNumber}>{stats.criticalAlerts}</Title>
            <Paragraph style={styles.statLabel}>Critical</Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Charts */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>System Overview</Title>
          <LineChart
            data={chartData}
            width={width - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(21, 101, 192, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Site Status Distribution</Title>
          <PieChart
            data={pieData}
            width={width - 60}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Recent Alerts */}
      <Card style={styles.alertsCard}>
        <Card.Content>
          <View style={styles.alertsHeader}>
            <Title>Recent Alerts</Title>
            <Button
              mode="text"
              onPress={() => setModalVisible(true)}
              compact
            >
              View All
            </Button>
          </View>
          
          {recentAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertContent}>
                <Chip
                  mode="outlined"
                  style={[
                    styles.severityChip,
                    { borderColor: getSeverityColor(alert.severity) },
                  ]}
                  textStyle={{ color: getSeverityColor(alert.severity) }}
                >
                  {alert.severity.toUpperCase()}
                </Chip>
                <View style={styles.alertText}>
                  <Paragraph style={styles.alertSite}>
                    {alert.site_name}
                  </Paragraph>
                  <Paragraph style={styles.alertMessage}>
                    {alert.message}
                  </Paragraph>
                  <Paragraph style={styles.alertTime}>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Paragraph>
                </View>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              icon="add-location"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Add Site
            </Button>
            <Button
              mode="outlined"
              icon="camera"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Data Collection
            </Button>
            <Button
              mode="outlined"
              icon="analytics"
              style={styles.actionButton}
              onPress={() => {}}
            >
              Generate Report
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Modal for full alerts view */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title>All Alerts</Title>
          <ScrollView style={styles.modalContent}>
            {recentAlerts.map((alert) => (
              <Card key={alert.id} style={styles.modalAlertCard}>
                <Card.Content>
                  <View style={styles.alertContent}>
                    <Chip
                      mode="outlined"
                      style={[
                        styles.severityChip,
                        { borderColor: getSeverityColor(alert.severity) },
                      ]}
                      textStyle={{ color: getSeverityColor(alert.severity) }}
                    >
                      {alert.severity.toUpperCase()}
                    </Chip>
                    <View style={styles.alertText}>
                      <Paragraph style={styles.alertSite}>
                        {alert.site_name}
                      </Paragraph>
                      <Paragraph style={styles.alertMessage}>
                        {alert.message}
                      </Paragraph>
                      <Paragraph style={styles.alertTime}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Paragraph>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
        </Modal>
      </Portal>
    </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#1565C0',
  },
  successCard: {
    backgroundColor: '#4CAF50',
  },
  warningCard: {
    backgroundColor: '#F57C00',
  },
  errorCard: {
    backgroundColor: '#D32F2F',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  chartCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  alertsCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  severityChip: {
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertSite: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  alertMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  actionsCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 32,
  },
  actionsContainer: {
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalContent: {
    marginVertical: 16,
  },
  modalAlertCard: {
    marginBottom: 8,
    elevation: 1,
  },
});

export default DashboardScreen;
