import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PaymentStats({ data }) {
    console.log("Data: ", data);

    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available.</div>;
    }

    // Transform data to ensure consistency for the chart
    const chartData = data.map(item => ({
        date: item.paidOn.split('T')[0], // Extracting the date part (e.g., "2025-06-25")
        Amount: item.amount,
        Penalty: item.penalty || 0, // Default to 0 if penalty is missing
    }));

    console.log("Char data: ", chartData);
    

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Amount" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Penalty" stroke="#ff7300" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PaymentStats;
