import { useState } from "react";
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
import { ComboboxDemo } from "../Rumah/Show/components/combobox";

const jenis_pembayaran = ["pemasukan", "pengeluaran"];
const jenis_pemasukan = ["iuran_kebersihan", "iuran_keamanan"];
const jenis_pengeluaran = ["gaji", "listrik", "perbaikan jalan"];
const rumah = [
	{ value: "rumah-1", label: "Rumah 1" },
	{ value: "rumah-2", label: "Rumah 2" },
	{ value: "rumah-3", label: "Rumah 3" },
];

const penghuni = [
	{ value: "john-doe", label: "John Doe" },
	{ value: "jane-doe", label: "Jane Doe" },
];

const pembayaranSchema = z.object({
	nominal: z.string().min(1, "Nominal wajib diisi"),
	jenis: z.enum(jenis_pembayaran, "Pilih jenis pembayaran"),
	keterangan: z.string().min(1, "Keterangan wajib diisi"),
	deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
	tanggal: z.string().min(1, "Tanggal wajib diisi"),
	id_penghuni: z.string().optional(),
	id_rumah: z.string().optional(),
});

export default function CreatePembayaran() {
	const [keteranganOptions, setKeteranganOptions] = useState([]);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(pembayaranSchema),
	});

	const handleJenisChange = (value) => {
		setValue("jenis", value);
		if (value === "pemasukan") {
			setKeteranganOptions(jenis_pemasukan);
		} else if (value === "pengeluaran") {
			setKeteranganOptions(jenis_pengeluaran);
		}
	};

	const onSubmit = (data) => {
		console.log("Form Data:", data);
		toast.success("Pembayaran berhasil ditambahkan");
	};


	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Tambah Pembayaran</h1>
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
					<Select onValueChange={handleJenisChange}>
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
					<Select onValueChange={(value) => setValue("keterangan", value)}>
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
						data={penghuni}
						currentValue={watch("id_penghuni")}
						onSelect={(selected) => setValue("id_penghuni", selected)}
					/>
				</div>

				{/* Rumah */}
				<div>
					<label className="block text-sm">Pilih Rumah</label>
					<ComboboxDemo
						data={rumah}
						currentValue={watch("id_rumah")}
						onSelect={(selected) => setValue("id_rumah", selected)}
					/>
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<Button type="submit">Simpan</Button>
				</div>
			</form>
		</div>
	);
}
