import { Link } from "react-router-dom";
import {
	PlusCircleIcon,
	Home,
	MapPin,
	CheckCircle,
	User,
	Briefcase,
	Heart,
	Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShowRumah() {
	return (
		<>
			<div className="mx-auto p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-4 flex items-center">
					Detail Rumah
				</h1>
				<div className="flex items-center gap-2 text-md mb-2">
					<Home size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Nama Rumah:</span> Rumah 1
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<MapPin size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Alamat:</span> Jl. Pahlawan No. 1
					</span>
				</div>
				<div className="flex items-center gap-2 text-md">
					<CheckCircle size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status:</span> Dihuni
					</span>
				</div>
			</div>

			<div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-5">
				<h1 className="text-2xl font-bold mb-4 flex items-center">
					Detail Penghuni
					<Link to="add-penghuni">
						<PlusCircleIcon className="ms-3 cursor-pointer" size={24} />
					</Link>
				</h1>
				<div className="flex items-center gap-2 text-md mb-2">
					<User size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Nama Penghuni:</span> Budi
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<Briefcase size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status:</span> Tetap
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<Heart size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status Pernikahan:</span> Belum Menikah
					</span>
				</div>
				<div className="flex items-center gap-2 text-md">
					<Calendar size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Tanggal Masuk:</span> 2021-08-01
					</span>
				</div>

				<div className="flex justify-end mt-4 gap-3">
					<Link to="history-pembayaran">
						<Button className="">History Pembayaran</Button>
					</Link>
					<Link to="history-penghuni">
						<Button className="">History Penghuni</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
