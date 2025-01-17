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
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const dummyData = [
	{
		id: 1,
		nama: "Jhon Doe",
		mulai: "2024-08-01",
		selesai: "2024-12-01",
	},
	{
		id: 2,
		nama: "Jane Doe",
		mulai: "2024-09-01",
		selesai: "2024-12-01",
	},
];

export default function PaymentHistory() {
	const [history, setHistory] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const { id } = useParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";

	const [searchTerm, setSearchTerm] = useState(querySearch);
	const [currentPage, setCurrentPage] = useState(queryPage);

	const historyPerPage = 5;

	useEffect(() => {
		setHistory(dummyData);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (currentPage > 1) params.set("page", currentPage.toString());
		setSearchParams(params);
	}, [searchTerm, currentPage, setSearchParams]);

	const filteredhistory = useMemo(() => {
		return history.filter(
			(r) =>
				r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.mulai.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.selesai.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [history, searchTerm]);

	const indexOfLast = currentPage * historyPerPage;
	const indexOfFirst = indexOfLast - historyPerPage;
	const currenthistory = filteredhistory.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredhistory.length / historyPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				History Penghuni
			</h1>
			<div className="flex justify-between items-center mb-4">
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
						<TableHead className="px-4 py-2 text-left">Nama</TableHead>
						<TableHead className="px-4 py-2 text-left">Tanggal Mulai</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Tanggal Selesai
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currenthistory.map((r, index) => (
						<TableRow key={r.id} className="dark:text-white">
							<TableCell className="whitespace-nowrap px-4 py-2">
								{indexOfFirst + index + 1}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.nama}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.mulai}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.selesai}
							</TableCell>
						</TableRow>
					))}
					{currenthistory.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								No history found.
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

			<div className="flex justify-end mt-4 gap-3">
				<Link to={`/rumah/${id}`}>
					<Button className="">Kembali</Button>
				</Link>
			</div>
		</div>
	);
}
