// components/Dashboard/WhatIfSimulator.jsx
import { useState } from 'react';
import emissionFactors from '../../utils/emissionFactors.json';

export default function WhatIfSimulator() {
  const [distance, setDistance] = useState(10);
  const [trips, setTrips] = useState(5);
  const [fromOption, setFromOption] = useState('car');
  const [toOption, setToOption] = useState('bus');

  const { transport } = emissionFactors;

  const fromCost = transport[fromOption] * distance * trips;
  const toCost = transport[toOption] * distance * trips;
  const savings = fromCost - toCost;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">
        What-If Simulator
      </h3>
      
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          What if I swap my...
        </p>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-xs font-medium text-gray-500 mb-1">
              From
            </label>
            <select
              id="from"
              value={fromOption}
              onChange={(e) => setFromOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
            </select>
          </div>

          <div>
            <label htmlFor="to" className="block text-xs font-medium text-gray-500 mb-1">
              To
            </label>
            <select
              id="to"
              value={toOption}
              onChange={(e) => setToOption(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="bike">Bike</option>
              <option value="walk">Walk</option>
            </select>
          </div>

          <div>
            <label htmlFor="distance" className="block text-xs font-medium text-gray-500 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="trips" className="block text-xs font-medium text-gray-500 mb-1">
              Trips per week
            </label>
            <input
              type="number"
              id="trips"
              value={trips}
              onChange={(e) => setTrips(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Result */}
        <div className="pt-4 text-center">
          <p className="text-sm text-gray-600">Potential weekly savings:</p>
          <p className="text-3xl font-bold text-green-600">
            {savings.toFixed(2)} kg CO₂
          </p>
        </div>
      </div>
    </div>
  );
}