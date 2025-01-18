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
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "@/utils/axios";

export default function PenghuniHistory() {
	const [history, setHistory] = useState([]);
	const [pagination, setPagination] = useState({
		total: 0,
		current_page: 1,
		last_page: 1,
		per_page: 5,
	});
	const [searchParams, setSearchParams] = useSearchParams();
	const { id } = useParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";
	const [searchTerm, setSearchTerm] = useState(querySearch);
	const [currentPage, setCurrentPage] = useState(queryPage);

	const historyPerPage = 5;

	useEffect(() => {
		fetchHistory();
	}, [searchTerm, currentPage]);

	const fetchHistory = async () => {
		try {
			const response = await axiosInstance.get(`/history-penghuni/${id}`, {
				params: {
					search: searchTerm,
					page: currentPage,
					per_page: historyPerPage,
				},
			});
			setHistory(response.data.data.data);
			setPagination(response.data.pagination);
		} catch (error) {
			console.error("Error fetching history data", error);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (currentPage > 1) params.set("page", currentPage.toString());
		setSearchParams(params);
	}, [searchTerm, currentPage, setSearchParams]);

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
					{history.length === 0 ? (
						<TableRow>
							<TableCell colSpan={4} className="text-center py-4">
								No history found.
							</TableCell>
						</TableRow>
					) : (
						history.map((r, index) => (
							<TableRow key={r.id} className="dark:text-white">
								<TableCell className="whitespace-nowrap px-4 py-2">
									{(currentPage - 1) * historyPerPage + index + 1}
								</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-2">
									{r.penghuni.nama}
								</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-2">
									{r.tanggal_masuk}
								</TableCell>
								<TableCell className="whitespace-nowrap px-4 py-2">
									{r.tanggal_keluar || "N/A"}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
			{/* Pagination */}
			{pagination.total > pagination.per_page && (
				<div className="flex justify-center mt-4">
					<nav>
						<ul className="inline-flex -space-x-px">
							{Array.from({ length: pagination.last_page }, (_, i) => (
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
