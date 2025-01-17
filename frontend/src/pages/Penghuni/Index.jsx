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
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const dummyData = [
	{
		id: 1,
		name: "John Doe",
		ktp: "https://via.placeholder.com/150",
		status: "KonTableRowak",
		phone: "08123456789",
		married: "Sudah Menikah",
	},
	{
		id: 2,
		name: "Jane Doe",
		ktp: "https://via.placeholder.com/150",
		status: "Tetap",
		phone: "08987654321",
		married: "Belum Menikah",
	},
];

export default function PenghuniIndex() {
	const [penghuni, setPenghuni] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";

	const [searchTerm, setSearchTerm] = useState(querySearch);
	const [currentPage, setCurrentPage] = useState(queryPage);

	const penghuniPerPage = 5;

	useEffect(() => {
		setPenghuni(dummyData); // Using dummyData directly
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (currentPage > 1) params.set("page", currentPage.toSTableRowing());
		setSearchParams(params);
	}, [searchTerm, currentPage, setSearchParams]);

	const filteredPenghuni = useMemo(() => {
		return penghuni.filter(
			(p) =>
				p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.married.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [penghuni, searchTerm]);

	const indexOfLast = currentPage * penghuniPerPage;
	const indexOfFirst = indexOfLast - penghuniPerPage;
	const currentPenghuni = filteredPenghuni.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredPenghuni.length / penghuniPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const deletePenghuni = (id) => {
		const updatedPenghuni = penghuni.filter((p) => p.id !== id);
		setPenghuni(updatedPenghuni);
		console.log(`Penghuni with ID: ${id} deleted.`);
	};

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				List Penghuni
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
						<TableHead className="px-4 py-2 text-left">
							Nama Lengkap
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							KTP
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Status Penghuni
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							No Telp
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Status Pernikahan
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentPenghuni.map((p, index) => (
						<TableRow key={p.id} className="dark:text-white">
							<TableCell className="whitespace-nowrap px-4 py-2">
								{indexOfFirst + index + 1}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{p.name}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<img
									src={p.ktp}
									alt="KTP"
									className="w-12 h-12 rounded"
								/>
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{p.status}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{p.phone}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{p.married}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<div className="flex gap-2">
									<Link
										to={`${p.id}/edit`}
										className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
										<Pencil size={16} />
									</Link>
									<button
										onClick={() => deletePenghuni(p.id)}
										className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
										<Trash2 size={16} />
									</button>
								</div>
							</TableCell>
						</TableRow>
					))}
					{currentPenghuni.length === 0 && (
						<TableRow>
							<TableCell colSpan={7} className="text-center py-4">
								No penghuni found.
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
