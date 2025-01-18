<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HistoryPenghuni;
use App\Models\Pembayaran;
use App\Models\Penghuni;

class AssignPenghuni extends Controller
{
    public function index($id)
    {
        $penghuniRumah = HistoryPenghuni::where('rumah_id', $id)
            ->where('tanggal_keluar', null)
            ->with('penghuni')
            ->first();

        return response()->json([
            'status' => 'success',
            'message' => 'Data penghuni retrieved successfully',
            'data' => $penghuniRumah
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'penghuni_id' => 'required|integer',
            'rumah_id' => 'required|integer',
            'tanggal_masuk' => 'required|date',
            'tanggal_keluar' => 'nullable|date'
        ]);

        $existingPenghuni = HistoryPenghuni::where('rumah_id', $validated['rumah_id'])
            ->where('tanggal_keluar', null)
            ->first();

        if ($existingPenghuni) {
            if (!$request->filled('tanggal_keluar')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Tanggal keluar harus diisi untuk mengganti penghuni'
                ], 422);
            }

            $existingPenghuni->update([
                'tanggal_keluar' => $validated['tanggal_keluar']
            ]);

            $existingPenghuni->rumah->update(['status_rumah' => 'kosong']);

            return response()->json([
                'status' => 'success',
                'message' => 'Penghuni berhasil dikeluarkan'
            ]);
        }

        $historyPenghuni = HistoryPenghuni::create($validated);
        $historyPenghuni->rumah->update(['status_rumah' => 'dihuni']);

        return response()->json([
            'status' => 'success',
            'message' => 'Penghuni berhasil ditambahkan'
        ]);
    }

    public function penghuniHistory(Request $request, $id)
    {
        $query = HistoryPenghuni::where('rumah_id', $id)
            ->with('penghuni')
            ->orderBy('tanggal_masuk', 'desc');

        if ($request->has('search')) {
            $search = $request->query('search');
            $query->whereHas('penghuni', function ($q) use ($search) {
                $q->where('nama', 'LIKE', "%$search%");
            });
        }

        $perPage = $request->query('per_page', 5);
        $historyPenghuni = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Data history penghuni retrieved successfully',
            'data' => $historyPenghuni,
            'pagination' => [
                'total' => $historyPenghuni->total(),
                'current_page' => $historyPenghuni->currentPage(),
                'last_page' => $historyPenghuni->lastPage(),
                'per_page' => $historyPenghuni->perPage(),
            ]
        ]);
    }

    public function pembayaranHistory(Request $request, $id)
    {
        $historyPenghuni = HistoryPenghuni::where('rumah_id', $id)
            ->where('tanggal_keluar', null)
            ->first();

        if (!$historyPenghuni) {
            return response()->json([
                'status' => 'error',
                'message' => 'No active penghuni found for this rumah',
            ], 404);
        }

        $pembayarans = Pembayaran::where('rumah_id', $id)
            ->where('penghuni_id', $historyPenghuni->penghuni_id)
            ->get();

        $payments = [];
        foreach ($pembayarans as $pembayaran) {
            $month = (new \DateTime($pembayaran->tanggal))->format('Y-m');
            if (!isset($payments[$month])) {
                $payments[$month] = [
                    'tanggal' => $month,
                    'terbayar' => 0,
                    'nominal' => 115000,
                    'lunas' => false,
                ];
            }
            $payments[$month]['terbayar'] += $pembayaran->nominal;
            $payments[$month]['lunas'] = $payments[$month]['terbayar'] >= $payments[$month]['nominal'];
        }

        // Apply pagination
        $perPage = $request->query('per_page', 5);
        $currentPage = $request->query('page', 1);
        $total = count($payments);
        $payments = array_slice(array_values($payments), ($currentPage - 1) * $perPage, $perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment history retrieved successfully',
            'data' => $payments,
            'pagination' => [
                'total' => $total,
                'current_page' => $currentPage,
                'last_page' => ceil($total / $perPage),
                'per_page' => $perPage,
            ]
        ]);
    }
}
