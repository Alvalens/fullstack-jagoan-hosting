import { Link } from "react-router-dom";
import {
	PencilIcon,
	Home,
	MapPin,
	CheckCircle,
	User,
	Briefcase,
	Heart,
	Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ShowRumah() {
	const [rumah, setRumah] = useState({});
	const [penghuni, setPenghuni] = useState({});
	const { id } = useParams();

	const fetchDetailRumah = async () => {
		try {
			const response = await axiosInstance.get(`/rumahs/${id}`);
			setRumah(response.data.data.rumah);
			setPenghuni(response.data.data.penghuni);
		} catch (error) {
			console.error("Error fetching rumah data", error);
		}
	}

	useEffect(() => {
		fetchDetailRumah();
	}, [id]);

	return (
		<>
			<div className="mx-auto p-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold mb-4 flex items-center">
					Detail Rumah
				</h1>
				<div className="flex items-center gap-2 text-md mb-2">
					<Home size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Nama Rumah:</span> {rumah.nama}
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<MapPin size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Alamat:</span> {rumah.alamat}
					</span>
				</div>
				<div className="flex items-center gap-2 text-md">
					<CheckCircle size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status:</span> {rumah.status_rumah}
					</span>
				</div>
			</div>

			<div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-5">
				<h1 className="text-2xl font-bold mb-4 flex items-center">
					Detail Penghuni
					<Link to="add-penghuni">
						<PencilIcon className="ms-3 cursor-pointer" size={24} />
					</Link>
				</h1>
				<div className="flex items-center gap-2 text-md mb-2">
					<User size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Nama Penghuni: </span> {penghuni?.nama ?? '-'}
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<Briefcase size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status: </span> {penghuni?.status ?? '-'}
					</span>
				</div>
				<div className="flex items-center gap-2 text-md mb-2">
					<Heart size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Status Pernikahan:</span> {penghuni?.status_pernikahan ?? '-'}</span>
				</div>
				<div className="flex items-center gap-2 text-md">
					<Calendar size={20} className="text-gray-600" />
					<span>
						<span className="font-bold">Tanggal Masuk:</span> {penghuni?.tanggal_masuk ?? '-'}
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
