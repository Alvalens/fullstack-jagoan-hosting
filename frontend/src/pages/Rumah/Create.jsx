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
import { useNavigate } from "react-router-dom";

const rumahSchema = z.object({
	nama: z.string().min(1, "Nama rumah wajib diisi"),
	alamat: z.string().min(1, "Alamat wajib diisi"),
	status_rumah: z.enum(["kosong", "dihuni"], "Pilih status rumah"),
});

export default function CreateRumah() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(rumahSchema),
	});

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			// Send data to API
			const response = await axiosInstance.post("/rumahs", data, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.data.status === "success") {
				toast.success("Rumah berhasil ditambahkan");
				navigate("/rumah");
			}
		} catch (error) {
			toast.error("Gagal menambahkan rumah");
			if (error.response.status === 422) {
				if (error.response.data.errors) {
					Object.entries(error.response.data.errors).forEach(([key, value]) => {
						toast.error(`${key}: ${value}`);
					});
				}
			}
		}
	};

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Tambah Rumah</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Nama Rumah */}
				<div>
					<Label htmlFor="nama">Nama Rumah</Label>
					<Input
						id="nama"
						{...register("nama")}
						placeholder="Masukkan nama rumah"
						className="mt-2"
					/>
					{errors.nama && (
						<p className="text-red-500 text-sm mt-1">{errors.nama.message}</p>
					)}
				</div>

				{/* Alamat */}
				<div>
					<Label htmlFor="alamat">Alamat</Label>
					<Input
						id="alamat"
						{...register("alamat")}
						placeholder="Masukkan alamat"
						className="mt-2"
					/>
					{errors.alamat && (
						<p className="text-red-500 text-sm mt-1">{errors.alamat.message}</p>
					)}
				</div>

				{/* Status Rumah */}
				<div>
					<Label>Status Rumah</Label>
					<Select onValueChange={(value) => setValue("status_rumah", value)}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih status rumah" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="kosong">Kosong</SelectItem>
							<SelectItem value="dihuni">Dihuni</SelectItem>
						</SelectContent>
					</Select>
					{errors.status_rumah && (
						<p className="text-red-500 text-sm mt-1">
							{errors.status_rumah.message}
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
