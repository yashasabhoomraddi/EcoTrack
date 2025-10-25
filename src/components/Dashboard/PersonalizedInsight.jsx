// components/Dashboard/PersonalizedInsight.jsx
import { useMemo } from 'react';
import { getPersonalizedInsight } from '../../utils/insightsGenerator';

// This component receives all the user's activities as a prop
export default function PersonalizedInsight({ activities }) {
  
  // useMemo ensures this logic only re-runs when activities change
  const insight = useMemo(() => getPersonalizedInsight(activities), [activities]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">
        Your Weekly Insight
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        💡 {insight}
      </p>
    </div>
  );
}