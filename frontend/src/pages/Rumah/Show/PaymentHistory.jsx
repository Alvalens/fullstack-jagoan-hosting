import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios";

export default function PaymentHistory() {
	const [payments, setPayments] = useState([]);
	const [pagination, setPagination] = useState({
		total: 0,
		current_page: 1,
		last_page: 1,
		per_page: 5,
	});
	const [searchParams, setSearchParams] = useSearchParams();
	const queryPage = parseInt(searchParams.get("page") || "1", 10);
	const { id } = useParams();

	const [currentPage, setCurrentPage] = useState(queryPage);
	const [loading, setLoading] = useState(false);

	const paymentsPerPage = 5;

	useEffect(() => {
		fetchPayments();
	}, [currentPage]);

	const fetchPayments = async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get(`/history-pembayaran/${id}`, {
				params: {
					page: currentPage,
					per_page: paymentsPerPage,
				},
			});
			setPayments(response.data.data);
			setPagination(response.data.pagination);
		} catch (error) {
			console.error("Error fetching payment history data", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const params = new URLSearchParams();
		if (currentPage > 1) params.set("page", currentPage.toString());
		setSearchParams(params);
	}, [currentPage, setSearchParams]);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="max-w-7xl mx-auto p-4 bg-white dark:bg-gray-600 shadow-sm rounded-md">
			<h1 className="text-2xl font-bold mb-4 dark:text-white">
				History Pembayaran
			</h1>
			{loading ? (
				<div className="text-center py-4">Loading...</div>
			) : (
				<>
					<Table>
						<TableHeader>
							<TableRow className="bg-gray-100 dark:bg-gray-700 dark:text-white">
								<TableHead className="px-4 py-2 text-left">#</TableHead>
								<TableHead className="px-4 py-2 text-left">Tanggal</TableHead>
								<TableHead className="px-4 py-2 text-left">Terbayar</TableHead>
								<TableHead className="px-4 py-2 text-left">
									Iuran Bulanan
								</TableHead>
								<TableHead className="px-4 py-2 text-left">
									Status Lunas
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-4">
										No payment history found.
									</TableCell>
								</TableRow>
							) : (
								payments.map((payment, index) => (
									<TableRow key={index} className="dark:text-white">
										<TableCell className="whitespace-nowrap px-4 py-2">
											{(currentPage - 1) * paymentsPerPage + index + 1}
										</TableCell>
										<TableCell className="whitespace-nowrap px-4 py-2">
											{payment.tanggal}
										</TableCell>
										<TableCell className="whitespace-nowrap px-4 py-2">
											Rp. {payment.terbayar.toLocaleString("id-ID")}
										</TableCell>
										<TableCell className="whitespace-nowrap px-4 py-2">
											Rp. {payment.nominal.toLocaleString("id-ID")}
										</TableCell>
										<TableCell className="whitespace-nowrap px-4 py-2">
											<span
												className={
													payment.lunas
														? "bg-green-100 text-green-800 py-1 px-2 rounded-md"
														: "bg-red-100 text-red-800 py-1 px-2 rounded-md"
												}>
												{payment.lunas ? "lunas" : "Belum"}
											</span>
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
				</>
			)}
			<div className="flex justify-end mt-4 gap-3">
				<Link to={`/rumah/${id}`}>
					<Button className="">Kembali</Button>
				</Link>
			</div>
		</div>
	);
}
