import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";



// Example existing data for displaying
const mockData = {
	nominal: "100.000",
	jenis: "pemasukan",
	keterangan: "iuran_kebersihan",
	deskripsi: "Iuran kebersihan bulan Agustus",
	tanggal: "2024-08-01",
	id_penghuni: "john-doe",
	id_rumah: "rumah-1",
};

export default function ShowPembayaran() {


	return (
		<div className="mx-auto p-6 bg-white rounded-lg shadow">
			<h1 className="text-2xl font-bold mb-4">Detail Pembayaran</h1>
			<div className="space-y-4">
				{/* Nominal */}
				<div>
					<Label>Nominal</Label>
					<p className="mt-2">{mockData.nominal}</p>
				</div>

				{/* Jenis */}
				<div>
					<Label>Jenis</Label>
					<p className="mt-2">{mockData.jenis}</p>
				</div>

				{/* Keterangan */}
				<div>
					<Label>Keterangan</Label>
					<p className="mt-2">{mockData.keterangan}</p>
				</div>

				{/* Deskripsi */}
				<div>
					<Label>Deskripsi</Label>
					<p className="mt-2">{mockData.deskripsi}</p>
				</div>

				{/* Tanggal */}
				<div>
					<Label>Tanggal</Label>
					<p className="mt-2">{mockData.tanggal}</p>
				</div>

				{/* Penghuni */}
				<div>
					<Label>Penghuni</Label>
					<p className="mt-2">{mockData.id_penghuni}</p>
				</div>

				{/* Rumah */}
				<div>
					<Label>Rumah</Label>
					<p className="mt-2">{mockData.id_rumah}</p>
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
