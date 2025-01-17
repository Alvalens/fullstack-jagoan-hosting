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

const dummyData = [
	{
		id: 1,
		name: "Rumah 1",
		address: "Jl. Raya",
		status: "tidak dihuni",
	},
	{
		id: 2,
		name: "Rumah 2",
		address: "Jl. Raya",
		penghuni: "Jane Doe",
		status: "dihuni",
	},
];

export default function RumahIndex() {
	const [rumah, setRumah] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const querySearch = searchParams.get("search") || "";

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
				r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.penghuni.toLowerCase().includes(searchTerm.toLowerCase()) ||
				r.status.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [rumah, searchTerm]);

	const indexOfLast = currentPage * rumahPerPage;
	const indexOfFirst = indexOfLast - rumahPerPage;
	const currentRumah = filteredRumah.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredRumah.length / rumahPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const deleteRumah = (id) => {
		const updatedRumah = rumah.filter((r) => r.id !== id);
		setRumah(updatedRumah);
		console.log(`Rumah with ID: ${id} deleted.`);
	};

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				List Rumah
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
							Nama Rumah
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Alamat
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Status
						</TableHead>
						<TableHead className="px-4 py-2 text-left">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRumah.map((r, index) => (
						<TableRow key={r.id} className="dark:text-white">
							<TableCell className="whitespace-nowrap px-4 py-2">
								{indexOfFirst + index + 1}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.name}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								{r.address}
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<span
									className={`px-2 py-1 rounded ${
										r.status === "dihuni"
											? "bg-green-100 text-green-800"
											: "bg-red-100 text-red-800"
									}`}>
									{r.status}
								</span>
							</TableCell>
							<TableCell className="whitespace-nowrap px-4 py-2">
								<div className="flex gap-2">
									<Link
										to={`${r.id}/show`}
										className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
										<Eye size={16} />
									</Link>
									<Link
										to={`${r.id}/edit`}
										className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
										<Pencil size={16} />
									</Link>
									<button
										onClick={() => deleteRumah(r.id)}
										className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
										<Trash2 size={16} />
									</button>
								</div>
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
		</div>
	);
}
