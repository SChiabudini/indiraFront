import React, { useMemo } from 'react';
import { useSelector } from "react-redux";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChart = () => {
    const soldProducts = useSelector(state => state.products.soldProducts);

    const { labels, data } = useMemo(() => {
        // Extract labels and data for the pie chart
        const labels = soldProducts.map(item => item.categoryName);
        const data = soldProducts.map(item => item.count);

        return { labels, data };
    }, [soldProducts]);

    const options = {};
    const pieCharData = {
        labels: labels,
        datasets: [
            {
                label: "Vendido",
                data: data,
                backgroundColor: [
                    "rgba(228, 182, 26, 1)",
                    "rgba(11, 12, 11, 1)",
                    "rgba(233, 234, 236, 1)",
                    "rgba(42, 46, 52, 1)",
                    "rgba(251, 225, 52, 1)",
                ],
                borderWidth: 4,
            }
        ]
    };

    return (
        <div className="component">
            <div className="title">
                <h2>POR CATEGORÍAS</h2>
            </div>
            <div className="container">
                <Pie options={options} data={pieCharData} />
            </div>
        </div>
    );
};

export default PieChart;
