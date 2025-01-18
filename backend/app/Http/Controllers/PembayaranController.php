<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Pembayaran::query();

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('keterangan', 'LIKE', "%$search%")
                    ->orWhere('deskripsi', 'LIKE', "%$search%")
                    ->orWhere('jenis', 'LIKE', "%$search%");
            }

            $perPage = $request->get('per_page', 5);
            $pembayarans = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayarans retrieved successfully',
                'data' => [
                    'pembayarans' => $pembayarans->items(),
                ],
                'pagination' => [
                    'total' => $pembayarans->total(),
                    'current_page' => $pembayarans->currentPage(),
                    'last_page' => $pembayarans->lastPage(),
                    'per_page' => $pembayarans->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving pembayarans: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve pembayarans',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nominal' => 'required|integer',
                'jenis' => 'required|in:pemasukan,pengeluaran',
                'keterangan' => 'required|string|max:255',
                'deskripsi' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'bulan' => 'required|integer|min:1|max:12',
                'nominal_per_bulan' => 'nullable|string',
                'penghuni_id' => 'nullable|exists:penghunis,id',
                'rumah_id' => 'nullable|exists:rumahs,id',
            ]);

            $nominalPerBulan = $validated['nominal'] / $validated['bulan'];
            $records = [];

            for ($i = 0; $i < $validated['bulan']; $i++) {
                $tanggal = (new \DateTime($validated['tanggal']))->modify("+$i month")->format('Y-m-d');
                $record = array_merge($validated, [
                    'nominal' => $nominalPerBulan,
                    'tanggal' => $tanggal,
                ]);
                unset($record['bulan']);
                $records[] = $record;
            }

            Pembayaran::insert($records);

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran created successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating pembayaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error' . $e->getMessage(),
                'message' => 'Failed to create pembayaran',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($id)->load('penghuni', 'rumah');

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran retrieved successfully',
                'data' => $pembayaran,
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving pembayaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve pembayaran',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($id);

            $validated = $request->validate([
                'nominal' => 'required|integer',
                'jenis' => 'required|in:pemasukan,pengeluaran',
                'keterangan' => 'required|string|max:255',
                'deskripsi' => 'required|string|max:255',
                'tanggal' => 'required|date',
                'penghuni_id' => 'nullable|exists:penghunis,id',
                'rumah_id' => 'nullable|exists:rumahs,id',
            ]);

            $pembayaran->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran updated successfully',
                'data' => $pembayaran,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating pembayaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update pembayaran',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($id);
            $pembayaran->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting pembayaran: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete pembayaran',
            ], 500);
        }
    }
}
