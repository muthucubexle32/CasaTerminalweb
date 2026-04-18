// src/components/admin/Charts.tsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { TrendingUp, PieChart } from 'lucide-react';

interface ChartsProps {
  type: 'revenue' | 'category';
}

const Charts = ({ type }: ChartsProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const colors = {
      primary: '#f97316',
      secondary: '#fb923c',
      light: '#fed7aa',
      dark: '#c2410c'
    };

    if (type === 'revenue') {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue 2024',
              data: [450000, 520000, 480000, 580000, 620000, 590000, 650000, 680000, 720000, 750000, 780000, 820000],
              borderColor: colors.primary,
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Revenue 2023',
              data: [380000, 420000, 400000, 450000, 480000, 460000, 490000, 520000, 550000, 580000, 600000, 630000],
              borderColor: colors.secondary,
              backgroundColor: 'rgba(251, 146, 60, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw as number; // cast to number
                  return `${context.dataset.label}: ₹${value.toLocaleString('en-IN')}`;
                }
              }
            }
          },
          scales: {
            y: { beginAtZero: true, ticks: { callback: (value) => '₹' + (Number(value) / 100000).toFixed(1) + 'L' } }
          }
        }
      });
    } else {
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Construction Materials', 'Equipment Rental', 'Professional Services'],
          datasets: [{
            data: [58, 25, 17],
            backgroundColor: [colors.primary, colors.secondary, colors.light],
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.raw as number;
                  const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value}% (${percentage}% of total)`;
                }
              }
            }
          }
        }
      });
    }

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [type]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              {type === 'revenue' ? <TrendingUp className="w-4 h-4 text-orange-600" /> : <PieChart className="w-4 h-4 text-orange-600" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{type === 'revenue' ? 'Revenue Overview' : 'Category Sales'}</h3>
              <p className="text-xs text-gray-500">{type === 'revenue' ? 'Monthly comparison' : 'Distribution by category'}</p>
            </div>
          </div>
        </div>
        <div className="h-64 sm:h-72"><canvas ref={chartRef}></canvas></div>
        {type === 'revenue' && (
          <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
            <div><p className="text-xs text-gray-500">Total</p><p className="text-sm font-semibold text-gray-800">₹45.6L</p></div>
            <div><p className="text-xs text-gray-500">Growth</p><p className="text-sm font-semibold text-green-600">+15.8%</p></div>
            <div><p className="text-xs text-gray-500">Avg</p><p className="text-sm font-semibold text-gray-800">₹4.2L</p></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Charts;