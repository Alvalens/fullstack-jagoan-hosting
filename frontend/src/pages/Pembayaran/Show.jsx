import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

export default function ShowPembayaran() {
	const { id } = useParams();
	const [pembayaran, setPembayaran] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPembayaran = async () => {
			setIsLoading(true);
			try {
				const response = await axiosInstance.get(`/pembayarans/${id}`);
				setPembayaran(response.data.data);
				console.log("Pembayaran data fetched", response.data);
			} catch (error) {
				console.error("Error fetching pembayaran data", error);
				toast.error("Gagal mengambil data pembayaran");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPembayaran();
	}, [id]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!pembayaran) {
		return <div>Data pembayaran tidak ditemukan</div>;
	}

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Detail Pembayaran</h1>
			<div className="space-y-4">
				{/* Nominal */}
				<div>
					<Label>Nominal</Label>
					<p className="mt-2">{pembayaran.nominal}</p>
				</div>

				{/* Jenis */}
				<div>
					<Label>Jenis</Label>
					<p className="mt-2">{pembayaran.jenis}</p>
				</div>

				{/* Keterangan */}
				<div>
					<Label>Keterangan</Label>
					<p className="mt-2">{pembayaran.keterangan}</p>
				</div>

				{/* Deskripsi */}
				<div>
					<Label>Deskripsi</Label>
					<p className="mt-2">{pembayaran.deskripsi}</p>
				</div>

				{/* Tanggal */}
				<div>
					<Label>Tanggal</Label>
					<p className="mt-2">{pembayaran.tanggal}</p>
				</div>

				{/* Penghuni */}
				<div>
					<Label>Penghuni</Label>
					<p className="mt-2">{pembayaran?.penghuni?.nama || "N/A"}</p>
				</div>

				{/* Rumah */}
				<div>
					<Label>Rumah</Label>
					<p className="mt-2">{pembayaran?.rumah?.nama || "N/A"}</p>
				</div>
			</div>

			<div className="mt-6">
				<Link to="/pembayaran">
					<Button>Back</Button>
				</Link>
			</div>
		</div>
	);
}
