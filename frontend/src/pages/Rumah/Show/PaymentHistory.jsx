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
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

const dummyData = [
	{
		id: 1,
		tanggal: "2024-08",
		terbayar: "15.000",
		nominal: "115.000",
		status: "Belum Lunas",
	},
	{
		id: 2,
		tanggal: "2024-09",
		terbayar: "115.000",
		nominal: "115.000",
		status: "Lunas",
	},
];

export default function PaymentHistory() {
	const [rumah, setRumah] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";
	const { id } = useParams();

	const [searchTerm, setSearchTerm] = useState(querySearch);
	const [currentPage, setCurrentPage] = useState(queryPage);

	const rumahPerPage = 5;

	useEffect(() => {
		setRumah(dummyData);
	}, []);

	useEffect(() => {
		const params = new URLSearchParams();
		if (searchTerm) params.set("search", searchTerm);
		if (currentPage > 1) params.set("page", currentPage.toString());
		setSearchParams(params);
	}, [searchTerm, currentPage, setSearchParams]);

	const filteredRumah = useMemo(() => {
		return rumah.filter(
			(r) =>
				r.tanggal.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.terbayar.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.nominal.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.status.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [rumah, searchTerm]);

	const indexOfLast = currentPage * rumahPerPage;
	const indexOfFirst = indexOfLast - rumahPerPage;
	const currentRumah = filteredRumah.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredRumah.length / rumahPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				History Pembayaran
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
						<TableHead className="px-4 py-2 text-left">Tanggal</TableHead>
						<TableHead className="px-4 py-2 text-left">Terbayar</TableHead>
						<TableHead className="px-4 py-2 text-left">Nominal</TableHead>
						<TableHead className="px-4 py-2 text-left">Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRumah.map((r, index) => (
						<TableRow key={r.id} className="dark:text-white">
							<TableCell className="whitespace-nowrap px-4 py-2">
								{indexOfFirst + index + 1}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.tanggal}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.terbayar}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.nominal}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<span
									className={
										r.status === "Lunas" ? "text-green-500" : "text-red-500"
									}>
									{r.status}
								</span>
							</TableCell>
						</TableRow>
					))}
					{currentRumah.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className="text-center py-4">
								No rumah found.
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
