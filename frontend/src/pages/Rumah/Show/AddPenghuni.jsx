import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ComboboxDemo } from "./components/combobox";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { useNavigate, useParams } from "react-router-dom";

const historyRumahSchema = z.object({
	id_penghuni: z.string().min(1, "Nama penghuni wajib diisi"),
	id_rumah: z.string().min(1, "Nama rumah wajib diisi"),
	tanggal_masuk: z.string().min(1, "Tanggal masuk wajib diisi"),
	tanggal_keluar: z.string().optional(),
});

export default function AddPenghuni() {
	const [existingPenghuni, setExistingPenghuni] = useState(null);
	const [penghuniOptions, setPenghuniOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { id } = useParams();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(historyRumahSchema),
		defaultValues: {
			id_rumah: id,
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const [existingResponse, penghuniResponse] = await Promise.all([
					axiosInstance.get(`/assign-penghuni/${id}`),
					axiosInstance.get("/search-penghuni"),
				]);

				if (existingResponse.data.data) {
					setExistingPenghuni(existingResponse.data.data);
					setValue("id_penghuni", existingResponse.data.data.penghuni.id.toString());
					setValue("tanggal_masuk", existingResponse.data.data.tanggal_masuk);

				}

				const formattedOptions = penghuniResponse.data.map((penghuni) => ({
					value: penghuni.id.toString(),
					label: penghuni.nama,
				}));
				setPenghuniOptions(formattedOptions);
				console.log("Penghuni Options:", formattedOptions);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Gagal mengambil data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [id, setValue]);

	const onSubmit = async (data) => {
		try {
			const response = await axiosInstance.post("/assign-penghuni", {
				...data,
				penghuni_id: data.id_penghuni,
				rumah_id: id,
			});

			if (response.data.status === "success") {
				toast.success("Penghuni berhasil ditambahkan");
				navigate("/rumah");
			}
		} catch (error) {
			console.error("Error submitting data:", error);
			toast.error(error.response?.data?.message || "Gagal menyimpan data");
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">
				{existingPenghuni ? "Update Penghuni" : "Tambah Penghuni"}
			</h1>

			{existingPenghuni && (
				<div className="mb-4 p-3 bg-yellow-100 rounded">
					<p className="text-yellow-700">
						Untuk mengganti penghuni, harap isi tanggal keluar terlebih dahulu.
					</p>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label className="block text-sm">Pilih Penghuni</label>
					<ComboboxDemo
						data={penghuniOptions}
						currentValue={watch("id_penghuni")}
						onSelect={(selected) => setValue("id_penghuni", selected)}
						disabled={Boolean(existingPenghuni)}
					/>
					{errors.id_penghuni && (
						<p className="text-red-500 text-sm mt-1">
							{errors.id_penghuni.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
					<Input
						id="tanggal_masuk"
						{...register("tanggal_masuk")}
						type="date"
						className="mt-2"
						disabled={Boolean(existingPenghuni)}
					/>
					{errors.tanggal_masuk && (
						<p className="text-red-500 text-sm mt-1">
							{errors.tanggal_masuk.message}
						</p>
					)}
				</div>

				{existingPenghuni && (
					<div>
						<Label htmlFor="tanggal_keluar">Tanggal Keluar</Label>
						<Input
							id="tanggal_keluar"
							{...register("tanggal_keluar")}
							type="date"
							className="mt-2"
						/>
						{errors.tanggal_keluar && (
							<p className="text-red-500 text-sm mt-1">
								{errors.tanggal_keluar.message}
							</p>
						)}
					</div>
				)}

				<div className="flex justify-end">
					<Button type="submit">
						{existingPenghuni ? "Update" : "Simpan"}
					</Button>
				</div>
			</form>
		</div>
	);
}