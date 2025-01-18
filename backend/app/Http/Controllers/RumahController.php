<?php

namespace App\Http\Controllers;

use App\Models\HistoryPenghuni;
use App\Models\Rumah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RumahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Rumah::query();

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('nama', 'LIKE', "%$search%")
                    ->orWhere('alamat', 'LIKE', "%$search%")
                    ->orWhere('status_rumah', 'LIKE', "%$search%");
            }

            $perPage = $request->get('per_page', 5);
            $rumahs = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Rumahs retrieved successfully',
                'data' => [
                    'rumahs' => $rumahs->items(),
                ],
                'pagination' => [
                    'total' => $rumahs->total(),
                    'current_page' => $rumahs->currentPage(),
                    'last_page' => $rumahs->lastPage(),
                    'per_page' => $rumahs->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving rumahs: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve rumahs',
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
                'nama' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'status_rumah' => 'required|in:kosong,dihuni',
            ]);

            $rumah = Rumah::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Rumah created successfully',
                'data' => $rumah,
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating rumah: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create rumah' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $rumah = Rumah::findOrFail($id);
            $currentPenghuni = HistoryPenghuni::where('rumah_id', $id)
                ->whereNull('tanggal_keluar')
                ->with('penghuni', 'rumah')
                ->first();

            return response()->json([
                'status' => 'success',
                'message' => 'Rumah retrieved successfully',
                'data' => [
                    'rumah' => $rumah,
                    'current_penghuni' => $currentPenghuni,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving rumah: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve rumah',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $rumah = Rumah::findOrFail($id);

            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'status_rumah' => 'required|in:kosong,dihuni',
            ]);

            $rumah->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Rumah updated successfully',
                'data' => $rumah,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating rumah: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update rumah',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $rumah = Rumah::findOrFail($id);
            $rumah->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Rumah deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting rumah: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete rumah',
            ], 500);
        }
    }
}
