"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { fetchActivePercentage } from "@/lib/Produit";

const ActiveProductsChart = () => {
  const [loading, setLoading] = useState(true);
  const [activePercentage, setActivePercentage] = useState(0);

  const getActivePercentage = useCallback(async () => {
    try {
      const percentage = await fetchActivePercentage();
      setActivePercentage(percentage);
    } catch (error) {
      console.error("Error fetching active percentage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getActivePercentage();
  }, [getActivePercentage]);

  const data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activePercentage, 100 - activePercentage],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350"],
      },
    ],
  };

  const options = {
    cutout: 0, // Ensure this is a full circle
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="h-[205px]">
      {loading ? <p>Loading...</p> : <Pie data={data} options={options} />}
    </div>
  );
};

export default ActiveProductsChart;
