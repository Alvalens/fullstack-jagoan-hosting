/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axiosInstance from "@/utils/axios";

const PembayaranIndex = () => {
	const [selectedRange, setSelectedRange] = useState({ start: "", end: "" });
	const [reportData, setReportData] = useState({
		total_pemasukan: 0,
		total_pengeluaran: 0,
		saldo: 0,
		monthly_data: [],
		pembayarans: [],
	});

	const fetchReportData = async () => {
		try {
			const response = await axiosInstance.get("/laporan", {
				params: {
					start_date: selectedRange.start,
					end_date: selectedRange.end,
				},
			});
			setReportData(response.data.data);
		} catch (error) {
			console.error("Error fetching report data", error);
		}
	};

	useEffect(() => {
		if (selectedRange.start && selectedRange.end) {
			fetchReportData();
		}
	}, [selectedRange]);

	const monthlyValues = [];
	const labels = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	let cumulativeSaldo = 0;
	let lastMonthWithData = 0;

	// Iterate through each month
	labels.forEach((label, index) => {
		const monthKey = new Date(2025, index).toISOString().slice(0, 7);
		if (reportData.monthly_data[monthKey] !== undefined) {
			cumulativeSaldo += reportData.monthly_data[monthKey];
			lastMonthWithData = index;
		}
		monthlyValues.push(cumulativeSaldo);
	});

	for (let i = lastMonthWithData + 1; i < labels.length; i++) {
		monthlyValues[i] = null;
	}

	const chartData = {
		labels: labels,
		datasets: [
			{
				label: "Saldo per Bulan",
				data: monthlyValues,
				fill: false,
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				spanGaps: false, // Ensure gaps are not spanned
			},
		],
	};
	return (
		<div className="container mx-auto p-6">
			{/* Card Summary */}
			<div className="grid grid-cols-3 gap-4 mb-6">
				<div className="p-4 bg-green-100 rounded shadow">
					<h3 className="text-lg font-bold">Total Pemasukan</h3>
					<p className="text-2xl">
						Rp {reportData.total_pemasukan.toLocaleString()}
					</p>
				</div>
				<div className="p-4 bg-red-100 rounded shadow">
					<h3 className="text-lg font-bold">Total Pengeluaran</h3>
					<p className="text-2xl">
						Rp {reportData.total_pengeluaran.toLocaleString()}
					</p>
				</div>
				<div className="p-4 bg-blue-100 rounded shadow">
					<h3 className="text-lg font-bold">Saldo</h3>
					<p className="text-2xl">Rp {reportData.saldo.toLocaleString()}</p>
				</div>
			</div>

			{/* Grafik */}
			<div className="mb-6">
				<Line data={chartData} />
			</div>

			{/* Input Date Range */}
			<div className="p-4 bg-gray-100 rounded shadow">
				<h3 className="text-lg font-bold mb-4">Generate Report</h3>
				<div className="flex gap-4 mb-4">
					<input
						type="date"
						className="border p-2 rounded"
						onChange={(e) =>
							setSelectedRange((prev) => ({ ...prev, start: e.target.value }))
						}
					/>
					<input
						type="date"
						className="border p-2 rounded"
						onChange={(e) =>
							setSelectedRange((prev) => ({ ...prev, end: e.target.value }))
						}
					/>
					<button
						className="bg-blue-500 text-white px-4 py-2 rounded"
						onClick={fetchReportData}>
						Generate
					</button>
				</div>

				{/* Table */}
				<table className="w-full border-collapse border border-gray-300">
					<thead>
						<tr className="bg-gray-200">
							<th className="border border-gray-300 p-2">Tanggal</th>
							<th className="border border-gray-300 p-2">Jenis</th>
							<th className="border border-gray-300 p-2">Keterangan</th>
							<th className="border border-gray-300 p-2">Nominal</th>
							<th className="border border-gray-300 p-2">Penghuni</th>
							<th className="border border-gray-300 p-2">Rumah</th>
						</tr>
					</thead>
					<tbody>
						{reportData.pembayarans.map((item) => (
							<tr key={item.id}>
								<td className="border border-gray-300 p-2">{item.tanggal}</td>
								<td className="border border-gray-300 p-2">{item.jenis}</td>
								<td className="border border-gray-300 p-2">
									{item.keterangan}
								</td>
								<td className="border border-gray-300 p-2">
									Rp {item.nominal.toLocaleString()}
								</td>
								<td className="border border-gray-300 p-2">
									{item.penghuni ? item.penghuni?.nama : ""}
								</td>
								<td className="border border-gray-300 p-2">
									{item.rumah ? item.rumah?.nama : ""}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PembayaranIndex;
