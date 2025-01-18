import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Trash2, Pencil, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const jenis_pembayaran = ["pemasukan", "pengeluaran"];
const jenis_pemasukan = ["iuran_kebersihan", "iuran_keamanan"];
const jenis_pengeluaran = ["gaji", "listrik", "perbaikan jalan"];
const dummyData = [
	{
		id: 1,
		nominal: "100.000",
		jenis: jenis_pembayaran[0],
		keterangan: jenis_pemasukan[0],
		deskripsi: "Iuran kebersihan bulan Agustus",
		tanggal: "2024-08-01",
		penghuni: "Jhon Doe",
		rumah: "rumah 1",
	},
	{
		id: 2,
		nominal: "200.000",
		jenis: jenis_pembayaran[1],
		keterangan: jenis_pengeluaran[0],
		deskripsi: "Gaji bulan Agustus",
		tanggal: "2024-08-01",
		penghuni: "",
		rumah: "",
	},
];

export default function PembayaranIndex() {
	const [pembayaran, setPembayaran] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";

	const [searchTerm, setSearchTerm] = useState(querySearch);
	const [currentPage, setCurrentPage] = useState(queryPage);

	const pembayaranPerPage = 5;

	useEffect(() => {
		setPembayaran(dummyData);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (currentPage > 1) params.set("page", currentPage.toString());
		setSearchParams(params);
	}, [searchTerm, currentPage, setSearchParams]);

	const filteredpembayaran = useMemo(() => {
		return pembayaran.filter(
			(r) =>
				r.nominal.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.penghuni.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.rumah.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [pembayaran, searchTerm]);

	const indexOfLast = currentPage * pembayaranPerPage;
	const indexOfFirst = indexOfLast - pembayaranPerPage;
	const currentpembayaran = filteredpembayaran.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredpembayaran.length / pembayaranPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const deletepembayaran = (id) => {
		const updatedpembayaran = pembayaran.filter((r) => r.id !== id);
		setPembayaran(updatedpembayaran);
		console.log(`pembayaran with ID: ${id} deleted.`);
	};

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				List pembayaran
			</h1>
			<div className="flex justify-between items-center mb-4">
				<Link to="create">
					<Button>Create</Button>
				</Link>
				<Input
					type="text"
					placeholder="Search..."
					className="border border-gray-300 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 w-30"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1);
					}}
				/>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="bg-gray-100 dark:bg-gray-700 dark:text-white">
						<TableHead className="px-4 py-2 text-left">#</TableHead>
						<TableHead className="px-4 py-2 text-left">Nominal</TableHead>
						<TableHead className="px-4 py-2 text-left">Jenis</TableHead>
						<TableHead className="px-4 py-2 text-left">Keterangan</TableHead>
						<TableHead className="px-4 py-2 text-left">Tanggal</TableHead>
						<TableHead className="px-4 py-2 text-left">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentpembayaran.map((r, index) => (
						<TableRow key={r.id} className="dark:text-white">
							<TableCell className="whitespace-nowrap px-4 py-2">
								{indexOfFirst + index + 1}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.nominal}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<span
									className={`px-2 py-1 rounded ${
										r.jenis === "pemasukan"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}>
									{r.jenis}
								</span>
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.keterangan}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.tanggal}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<div className="flex gap-2">
									<Link
										to={`${r.id}`}
										className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
										<Eye size={16} />
									</Link>
									<Link
										to={`${r.id}/edit`}
										className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
										<Pencil size={16} />
									</Link>
									<button
										onClick={() => deletepembayaran(r.id)}
										className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
										<Trash2 size={16} />
									</button>
								</div>
							</TableCell>
						</TableRow>
					))}
					{currentpembayaran.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								No pembayaran found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-4">
					<nav>
						<ul className="inline-flex -space-x-px">
							{Array.from({ length: totalPages }, (_, i) => (
								<li key={i}>
									<button
										onClick={() => paginate(i + 1)}
										className={`px-3 py-2 border ${
											currentPage === i + 1
												? "bg-blue-500 text-white"
												: "bg-white text-gray-700"
										} border-gray-300`}>
										{i + 1}
									</button>
								</li>
							))}
						</ul>
					</nav>
				</div>
			)}
		</div>
	);
}
