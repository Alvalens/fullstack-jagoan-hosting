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
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Adjust the schema to match the new record fields
const rumahSchema = z.object({
	name: z.string().min(1, "Nama rumah wajib diisi"),
	address: z.string().min(1, "Alamat wajib diisi"),
	status: z.enum(["dihuni", "tidak dihuni"], "Pilih status rumah"),
});

// Example existing data for editing
const mockData = {
	name: "Rumah 1",
	address: "Jl. Raya",
	status: "tidak dihuni",
};


export default function EditRumah() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(rumahSchema),
		defaultValues: mockData,
	});

	// Load existing data into form
	useEffect(() => {
		setValue("name", mockData.name);
		setValue("address", mockData.address);
		setValue("status", mockData.status);
	}, [setValue]);

	const onSubmit = (data) => {
		console.log("Form Data:", data);
		toast.success("Data rumah berhasil diperbarui");
	};

	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Edit Rumah</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Nama Rumah */}
				<div>
					<Label htmlFor="name">Nama Rumah</Label>
					<Input
						id="name"
						{...register("name")}
						placeholder="Masukkan nama rumah"
						className="mt-2"
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Alamat */}
				<div>
					<Label htmlFor="address">Alamat</Label>
					<Input
						id="address"
						{...register("address")}
						placeholder="Masukkan alamat"
						className="mt-2"
					/>
					{errors.address && (
						<p className="text-red-500 text-sm mt-1">
							{errors.address.message}
						</p>
					)}
				</div>

				{/* Status */}
				<div>
					<Label>Status</Label>
					<Select
						onValueChange={(value) => setValue("status", value)}
						value={mockData.status}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih status rumah" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="dihuni">Dihuni</SelectItem>
							<SelectItem value="tidak dihuni">
								Tidak Dihuni
							</SelectItem>
						</SelectContent>
					</Select>
					{errors.status && (
						<p className="text-red-500 text-sm mt-1">
							{errors.status.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<div className="flex justify-end">
					<Button type="submit">Perbarui</Button>
				</div>
			</form>
		</div>
	);
}
