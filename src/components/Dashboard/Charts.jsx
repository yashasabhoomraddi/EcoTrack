import React from 'react'
import { PolarArea, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)

export default function Charts({ activities }) {
  const getCarbonByType = () => {
    const types = ['transport', 'meal', 'energy', 'waste']
    return types.map(type => {
      const typeActivities = activities.filter(a => a.type === type)
      return typeActivities.reduce((sum, a) => sum + (parseFloat(a.carbon_kg) || 0), 0)
    })
  }

  // Polar Area Chart Data - Carbon Impact by Type
  const polarAreaData = {
    labels: ['Transport', 'Meals', 'Energy', 'Waste'],
    datasets: [
      {
        label: 'Carbon Impact (kg CO₂)',
        data: getCarbonByType(),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const barChartData = {
    labels: ['Transport', 'Meals', 'Energy', 'Waste'],
    datasets: [
      {
        label: 'Carbon by Type (kg CO₂)',
        data: getCarbonByType(),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const doughnutChartData = {
    labels: ['Transport', 'Meals', 'Energy', 'Waste'],
    datasets: [
      {
        label: 'Activity Distribution',
        data: [
          activities.filter(a => a.type === 'transport').length,
          activities.filter(a => a.type === 'meal').length,
          activities.filter(a => a.type === 'energy').length,
          activities.filter(a => a.type === 'waste').length,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Improved Chart Options with larger text
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  }

  const polarAreaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
    },
    scales: {
      r: {
        ticks: {
          display: false
        }
      }
    }
  }

  return (
    <div className="charts-container">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NEW: Polar Area Chart - Carbon Impact */}
        <div className="chart-card bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Carbon Impact by Type</h3>
          <div className="chart-wrapper" style={{ height: '300px' }}>
            <PolarArea data={polarAreaData} options={polarAreaOptions} />
          </div>
        </div>

        {/* Bar Chart - Carbon by Type */}
        <div className="chart-card bg-white rounded-2xl shadow-lg border border-green-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Carbon by Activity Type</h3>
          <div className="chart-wrapper" style={{ height: '300px' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart - Activity Distribution */}
        <div className="chart-card bg-white rounded-2xl shadow-lg border border-green-100 p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Activity Distribution</h3>
          <div className="chart-wrapper" style={{ height: '300px' }}>
            <Doughnut data={doughnutChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}