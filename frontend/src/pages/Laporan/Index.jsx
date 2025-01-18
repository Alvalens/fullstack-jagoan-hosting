import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const jenis_pembayaran = ["pemasukan", "pengeluaran"];
const jenis_pemasukan = ["iuran_kebersihan", "iuran_keamanan"];
const jenis_pengeluaran = ["gaji", "listrik", "perbaikan jalan"];

const dummyData = [
	{
		id: 1,
		nominal: 100000,
		jenis: jenis_pembayaran[0],
		keterangan: jenis_pemasukan[0],
		deskripsi: "Iuran kebersihan bulan Agustus",
		tanggal: "2024-08-01",
		penghuni: "Jhon Doe",
		rumah: "rumah 1",
	},
	{
		id: 2,
		nominal: 200000,
		jenis: jenis_pembayaran[1],
		keterangan: jenis_pengeluaran[0],
		deskripsi: "Gaji bulan Agustus",
		tanggal: "2024-08-01",
		penghuni: "",
		rumah: "",
	},
];

const PembayaranIndex = () => {
	const [selectedRange, setSelectedRange] = useState({ start: "", end: "" });
	const [filteredData, setFilteredData] = useState(dummyData);

	// Data summary
	const totalPemasukan = dummyData
		.filter((d) => d.jenis === "pemasukan")
		.reduce((sum, d) => sum + d.nominal, 0);

	const totalPengeluaran = dummyData
		.filter((d) => d.jenis === "pengeluaran")
		.reduce((sum, d) => sum + d.nominal, 0);

	const saldo = totalPemasukan - totalPengeluaran;

	// Grafik data
	const monthlyData = Array(12).fill(0); // Placeholder data
	dummyData.forEach((item) => {
		const month = new Date(item.tanggal).getMonth(); // Get month index
		if (item.jenis === "pemasukan") {
			monthlyData[month] += item.nominal;
		} else {
			monthlyData[month] -= item.nominal;
		}
	});

	const chartData = {
		labels: [
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
		],
		datasets: [
			{
				label: "Saldo per Bulan",
				data: monthlyData,
				fill: false,
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
			},
		],
	};

	// Filter data by date range
	const handleFilter = () => {
		if (selectedRange.start && selectedRange.end) {
			const filtered = dummyData.filter((item) => {
				const date = new Date(item.tanggal);
				return (
					date >= new Date(selectedRange.start) &&
					date <= new Date(selectedRange.end)
				);
			});
			setFilteredData(filtered);
		}
	};

	return (
		<div className="container mx-auto p-6">
			{/* Card Summary */}
			<div className="grid grid-cols-3 gap-4 mb-6">
				<div className="p-4 bg-green-100 rounded shadow">
					<h3 className="text-lg font-bold">Total Pemasukan</h3>
					<p className="text-2xl">Rp {totalPemasukan.toLocaleString()}</p>
				</div>
				<div className="p-4 bg-red-100 rounded shadow">
					<h3 className="text-lg font-bold">Total Pengeluaran</h3>
					<p className="text-2xl">Rp {totalPengeluaran.toLocaleString()}</p>
				</div>
				<div className="p-4 bg-blue-100 rounded shadow">
					<h3 className="text-lg font-bold">Saldo</h3>
					<p className="text-2xl">Rp {saldo.toLocaleString()}</p>
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
						onClick={handleFilter}>
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
						{filteredData.map((item) => (
							<tr key={item.id}>
								<td className="border border-gray-300 p-2">{item.tanggal}</td>
								<td className="border border-gray-300 p-2">{item.jenis}</td>
								<td className="border border-gray-300 p-2">
									{item.keterangan}
								</td>
								<td className="border border-gray-300 p-2">
									Rp {item.nominal.toLocaleString()}
								</td>
								<td className="border border-gray-300 p-2">{item.penghuni}</td>
								<td className="border border-gray-300 p-2">{item.rumah}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PembayaranIndex;
