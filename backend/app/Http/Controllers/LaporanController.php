<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pembayaran;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Pembayaran::query();

        if ($startDate && $endDate) {
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        $pembayarans = $query->get();

        $totalPemasukan = $pembayarans->where('jenis', 'pemasukan')->sum('nominal');
        $totalPengeluaran = $pembayarans->where('jenis', 'pengeluaran')->sum('nominal');
        $saldo = $totalPemasukan - $totalPengeluaran;

        $monthlyData = [];
        foreach ($pembayarans as $pembayaran) {
            $month = (new \DateTime($pembayaran->tanggal))->format('Y-m');
            if (!isset($monthlyData[$month])) {
                $monthlyData[$month] = 0;
            }
            if ($pembayaran->jenis === 'pemasukan') {
                $monthlyData[$month] += $pembayaran->nominal;
            } else {
                $monthlyData[$month] -= $pembayaran->nominal;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Report data retrieved successfully',
            'data' => [
                'total_pemasukan' => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo' => $saldo,
                'monthly_data' => $monthlyData,
                'pembayarans' => $pembayarans,
            ],
        ]);
    }
}
