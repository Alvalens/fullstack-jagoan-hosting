import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { ComboboxDemo } from "./components/combobox";

const historyRumahSchema = z.object({
	id_penghuni: z.string().min(1, "Nama penghuni wajib diisi"),
	id_rumah: z.string().min(1, "Nama rumah wajib diisi"),
	tanggal_masuk: z.string().min(1, "Tanggal masuk wajib diisi"),
	tanggal_keluar: z.string().optional(),
});

const penghuniOptions = [
	{ value: "john-doe", label: "John Doe" },
	{ value: "jane-doe", label: "Jane Doe" },
];


export default function AddPenghuni() {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(historyRumahSchema),
	});

	const onSubmit = (data) => {
		console.log("Form Data:", data);
		toast.success("Rumah berhasil ditambahkan");
	};
	const currentPenghuniValue = watch("id_penghuni");
	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Tambah Penghuni</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

				{/* Nama Penghuni */}
				<div>
					<label className="block text-sm">Pilih Penghuni</label>
					<ComboboxDemo
						data={penghuniOptions}
						currentValue={currentPenghuniValue}
						onSelect={(selected) =>
							setValue("id_penghuni", selected)
						}
					/>
				</div>

				{/* Tanggal masuk */}
				<div>
					<Label htmlFor="tanggal_masuk">Tanggal Masuk</Label>
					<Input
						id="tanggal_masuk"
						{...register("tanggal_masuk")}
						placeholder="Masukkan tanggal masuk"
						className="mt-2"
						type="date"
					/>
					{errors.tanggal_masuk && (
						<p className="text-red-500 text-sm mt-1">
							{errors.tanggal_masuk.message}
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
