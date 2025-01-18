import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import { ComboboxDemo } from "../Rumah/Show/components/combobox";

const jenis_pembayaran = ["pemasukan", "pengeluaran"];
const jenis_pemasukan = ["iuran kebersihan", "iuran keamanan"];
const jenis_pengeluaran = [
	"gaji satpam",
	"listrik satpam",
	"perbaikan jalan",
	"perbaikan selokan",
	"lain-lain",
];

const pembayaranSchema = z.object({
	nominal: z.string().min(1, "Nominal wajib diisi"),
	jenis: z.enum(jenis_pembayaran, "Pilih jenis pembayaran"),
	keterangan: z.string().min(1, "Keterangan wajib diisi"),
	deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
	tanggal: z.string().min(1, "Tanggal wajib diisi"),
	nominal_per_bulan: z.string().optional(),
	penghuni_id: z.string().optional(),
	rumah_id: z.string().optional(),
});

export default function EditPembayaran() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [keteranganOptions, setKeteranganOptions] = useState([]);
	const [penghuniOptions, setPenghuniOptions] = useState([]);
	const [rumahOptions, setRumahOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(pembayaranSchema),
	});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [pembayaranResponse, penghuniResponse, rumahResponse] =
					await Promise.all([
						axiosInstance.get(`/pembayarans/${id}`),
						axiosInstance.get("/search-penghuni"),
						axiosInstance.get("/search-rumah"),
					]);

				const pembayaran = pembayaranResponse.data.data;
				setValue("nominal", pembayaran.nominal);
				setValue("jenis", pembayaran.jenis);
				setValue("keterangan", pembayaran.keterangan);
				setValue("deskripsi", pembayaran.deskripsi);
				setValue("tanggal", pembayaran.tanggal);
				setValue("penghuni_id", pembayaran.penghuni_id.toString());
				setValue("rumah_id", pembayaran.rumah_id.toString());

				if (pembayaran.jenis === "pemasukan") {
					setKeteranganOptions(jenis_pemasukan);
				} else if (pembayaran.jenis === "pengeluaran") {
					setKeteranganOptions(jenis_pengeluaran);
				}

				const formattedPenghuniOptions = penghuniResponse.data.map(
					(penghuni) => ({
						value: penghuni.id.toString(),
						label: penghuni.nama,
					})
				);
				setPenghuniOptions(formattedPenghuniOptions);

				const formattedRumahOptions = rumahResponse.data.map((rumah) => ({
					value: rumah.id.toString(),
					label: rumah.nama,
				}));
				setRumahOptions(formattedRumahOptions);

			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Gagal mengambil data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, setValue]);

	const handleJenisChange = (value) => {
		setValue("jenis", value);
		if (value === "pemasukan") {
			setKeteranganOptions(jenis_pemasukan);
		} else if (value === "pengeluaran") {
			setKeteranganOptions(jenis_pengeluaran);
		}
	};

	const onSubmit = async (data) => {
		try {
			// Send data to API
			const response = await axiosInstance.put(`/pembayarans/${id}`, data, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.data.status === "success") {
				toast.success("Pembayaran berhasil diperbarui");
				navigate("/pembayaran");
			}
		} catch (error) {
			toast.error("Gagal memperbarui pembayaran");
			if (error.response.status === 422) {
				if (error.response.data.errors) {
					Object.entries(error.response.data.errors).forEach(([key, value]) => {
						toast.error(`${key}: ${value}`);
					});
				}
			}
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Edit Pembayaran</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Nominal */}
				<div>
					<Label htmlFor="nominal">Nominal</Label>
					<Input
						id="nominal"
						{...register("nominal")}
						placeholder="Masukkan nominal"
						className="mt-2"
					/>
					{errors.nominal && (
						<p className="text-red-500 text-sm mt-1">
							{errors.nominal.message}
						</p>
					)}
				</div>

				{/* Jenis */}
				<div>
					<Label>Jenis</Label>
					<Select onValueChange={handleJenisChange} value={watch("jenis")}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih jenis pembayaran" />
						</SelectTrigger>
						<SelectContent>
							{jenis_pembayaran.map((jenis) => (
								<SelectItem key={jenis} value={jenis}>
									{jenis}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.jenis && (
						<p className="text-red-500 text-sm mt-1">{errors.jenis.message}</p>
					)}
				</div>

				{/* Keterangan */}
				<div>
					<Label>Keterangan</Label>
					<Select
						onValueChange={(value) => setValue("keterangan", value)}
						value={watch("keterangan")}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih keterangan" />
						</SelectTrigger>
						<SelectContent>
							{keteranganOptions.map((keterangan) => (
								<SelectItem key={keterangan} value={keterangan}>
									{keterangan}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.keterangan && (
						<p className="text-red-500 text-sm mt-1">
							{errors.keterangan.message}
						</p>
					)}
				</div>

				{/* Deskripsi */}
				<div>
					<Label htmlFor="deskripsi">Deskripsi</Label>
					<Input
						id="deskripsi"
						{...register("deskripsi")}
						placeholder="Masukkan deskripsi"
						className="mt-2"
					/>
					{errors.deskripsi && (
						<p className="text-red-500 text-sm mt-1">
							{errors.deskripsi.message}
						</p>
					)}
				</div>

				{/* Tanggal */}
				<div>
					<Label htmlFor="tanggal">Tanggal</Label>
					<Input
						id="tanggal"
						{...register("tanggal")}
						placeholder="Masukkan tanggal"
						className="mt-2"
						type="date"
					/>
					{errors.tanggal && (
						<p className="text-red-500 text-sm mt-1">
							{errors.tanggal.message}
						</p>
					)}
				</div>

				{/* Penghuni */}
				<div>
					<label className="block text-sm">Pilih Penghuni</label>
					<ComboboxDemo
						data={penghuniOptions}
						currentValue={watch("penghuni_id")}
						onSelect={(selected) => setValue("penghuni_id", selected)}
					/>
				</div>

				{/* Rumah */}
				<div>
					<label className="block text-sm">Pilih Rumah</label>
					<ComboboxDemo
						data={rumahOptions}
						currentValue={watch("rumah_id")}
						onSelect={(selected) => setValue("rumah_id", selected)}
					/>
				</div>
				<span className="text-sm text-gray-500">
					{" "}
					* untuk pengeluaran, penghuni dan rumah dapat dikosongakn
				</span>
				{/* Submit Button */}
				<div className="flex justify-end">
					<Button type="submit">Perbarui</Button>
				</div>
			</form>
		</div>
	);
}
