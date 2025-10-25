import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function Charts({ activities }) {
  // Get last 7 days of data
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    return days
  }

  // Calculate carbon per day for last 7 days
  const getCarbonPerDay = () => {
    const days = getLast7Days()
    const carbonData = days.map(day => {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
        return activityDate === day
      })
      return dayActivities.reduce((sum, a) => sum + (parseFloat(a.carbon_kg) || 0), 0)
    })
    return carbonData
  }

  // Calculate carbon by activity type
  const getCarbonByType = () => {
    const types = ['transport', 'meal', 'energy', 'waste']
    return types.map(type => {
      const typeActivities = activities.filter(a => a.type === type)
      return typeActivities.reduce((sum, a) => sum + (parseFloat(a.carbon_kg) || 0), 0)
    })
  }

  // Line Chart Data - Carbon over last 7 days
  const lineChartData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Carbon Footprint (kg CO₂)',
        data: getCarbonPerDay(),
        borderColor: 'rgb(76, 175, 80)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Bar Chart Data - Carbon by activity type
  const barChartData = {
    labels: ['Transport', 'Meals', 'Energy', 'Waste'],
    datasets: [
      {
        label: 'Carbon by Type (kg CO₂)',
        data: getCarbonByType(),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
      },
    ],
  }

  // Doughnut Chart Data - Activity distribution
  const doughnutChartData = {
    labels: ['Transport', 'Meals', 'Energy', 'Waste'],
    datasets: [
      {
        label: 'Activities',
        data: [
          activities.filter(a => a.type === 'transport').length,
          activities.filter(a => a.type === 'meal').length,
          activities.filter(a => a.type === 'energy').length,
          activities.filter(a => a.type === 'waste').length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  }

  return (
    <div className="charts-container">
      <h2>Analytics & Insights</h2>
      
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Carbon Footprint Trend (Last 7 Days)</h3>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Carbon by Activity Type</h3>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Activity Distribution</h3>
          <div className="chart-wrapper">
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}