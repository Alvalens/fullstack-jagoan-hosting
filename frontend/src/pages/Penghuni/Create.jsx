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
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import { useNavigate } from "react-router-dom";

const penghuniSchema = z.object({
	namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
	fotoKTP: z
		.instanceof(File)
		.refine((file) => file.size < 5 * 1024 * 1024, "Ukuran file maksimal 5MB"),
	statusPenghuni: z.enum(["kontrak", "tetap"], "Pilih status penghuni"),
	nomorTelepon: z.string().regex(/^08\d{8,11}$/, "Nomor telepon tidak valid"),
	statusPernikahan: z.enum(["sudah", "belum"], "Pilih status pernikahan"),
});

export default function CreatePenghuni() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(penghuniSchema),
	});

	const [fotoPreview, setFotoPreview] = useState(null);
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			// Create FormData to handle file upload
			const formData = new FormData();
			formData.append("nama", data.namaLengkap);
			formData.append("ktp", data.fotoKTP);
			formData.append("no_hp", data.nomorTelepon);
			formData.append("status_penghuni", data.statusPenghuni);
			formData.append("status_pernikahan", data.statusPernikahan);

			// Send data to API
			const response = await axiosInstance.post("/penghunis", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.status === "success") {
				toast.success("Penghuni berhasil ditambahkan");
				// delay 1s to wait for the toast to disappear
				setTimeout(() => {
					navigate("/penghuni");
				}, 1000);
			}
		} catch (error) {
			toast.error("Gagal menambahkan penghuni");
			if (error.response.status === 422) {
				if (error.response.data.errors) {
					Object.entries(error.response.data.errors).forEach(([key, value]) => {
						toast.error(`${key}: ${value}`);
					});
				}
			}
		}
	};

	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setValue("fotoKTP", file);
			setFotoPreview(URL.createObjectURL(file));
		}
	};

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Tambah Penghuni</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Nama Lengkap */}
				<div>
					<Label htmlFor="namaLengkap">Nama Lengkap</Label>
					<Input
						id="namaLengkap"
						{...register("namaLengkap")}
						placeholder="Masukkan nama lengkap"
						className="mt-2"
					/>
					{errors.namaLengkap && (
						<p className="text-red-500 text-sm mt-1">
							{errors.namaLengkap.message}
						</p>
					)}
				</div>

				{/* Foto KTP */}
				<div>
					<Label htmlFor="fotoKTP">Foto KTP</Label>
					<Input
						id="fotoKTP"
						type="file"
						accept="image/*"
						onChange={handleFileUpload}
						className="mt-2"
					/>
					{fotoPreview && (
						<img
							src={fotoPreview}
							alt="Preview KTP"
							className="mt-2 w-32 h-32 object-cover rounded"
						/>
					)}
					{errors.fotoKTP && (
						<p className="text-red-500 text-sm mt-1">
							{errors.fotoKTP.message}
						</p>
					)}
				</div>

				{/* Status Penghuni */}
				<div>
					<Label>Status Penghuni</Label>
					<Select onValueChange={(value) => setValue("statusPenghuni", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih status penghuni" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="kontrak">Kontrak</SelectItem>
							<SelectItem value="tetap">Tetap</SelectItem>
						</SelectContent>
					</Select>
					{errors.statusPenghuni && (
						<p className="text-red-500 text-sm mt-1">
							{errors.statusPenghuni.message}
						</p>
					)}
				</div>

				{/* Nomor Telepon */}
				<div>
					<Label htmlFor="nomorTelepon">Nomor Telepon</Label>
					<Input
						id="nomorTelepon"
						{...register("nomorTelepon")}
						placeholder="Masukkan nomor telepon"
						className="mt-2"
					/>
					{errors.nomorTelepon && (
						<p className="text-red-500 text-sm mt-1">
							{errors.nomorTelepon.message}
						</p>
					)}
				</div>

				{/* Status Pernikahan */}
				<div>
					<Label>Status Pernikahan</Label>
					<Select
						onValueChange={(value) => setValue("statusPernikahan", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih status pernikahan" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="sudah">Sudah Menikah</SelectItem>
							<SelectItem value="belum">Belum Menikah</SelectItem>
						</SelectContent>
					</Select>
					{errors.statusPernikahan && (
						<p className="text-red-500 text-sm mt-1">
							{errors.statusPernikahan.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<Button type="submit">Simpan</Button>
				</div>
			</form>
		</div>
	);
}
