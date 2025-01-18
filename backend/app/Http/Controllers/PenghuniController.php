<?php

namespace App\Http\Controllers;

use App\Models\Penghuni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PenghuniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Penghuni::query();

            if ($request->has('search')) {
                $search = $request->query('search');
                $query->where('nama', 'LIKE', "%$search%")->orWhere('no_hp', 'LIKE', "%$search%")->orWhere('status_penghuni', 'LIKE', "%$search%")->orWhere('status_pernikahan', 'LIKE', "%$search%");
            }

            $perPage = $request->get('per_page', 5);
            $penghunis = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Penghunis retrieved successfully',
                'data' => [
                    'penghunis' => $penghunis->items(),
                ],
                'pagination' => [
                    'total' => $penghunis->total(),
                    'current_page' => $penghunis->currentPage(),
                    'last_page' => $penghunis->lastPage(),
                    'per_page' => $penghunis->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving penghunis: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve penghunis',
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
                'ktp' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'no_hp' => 'required|string|max:15',
                'status_penghuni' => 'required|in:tetap,kontrak',
                'status_pernikahan' => 'required|in:belum,sudah',
            ]);

            if ($request->hasFile('ktp')) {
                $ktpPath = $request->file('ktp')->store('ktp_images', 'public');
                $validated['ktp'] = $ktpPath;
            }

            $penghuni = Penghuni::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Penghuni created successfully',
                'data' => $penghuni,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating penghuni: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create penghuni',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $penghuni = Penghuni::findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Penghuni retrieved successfully',
                'data' => $penghuni,
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving penghuni: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve penghuni',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $penghuni = Penghuni::findOrFail($id);

            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'ktp' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'no_hp' => 'required|string|max:15',
                'status_penghuni' => 'required|in:tetap,kontrak',
                'status_pernikahan' => 'required|in:belum_menikah,menikah',
            ]);

            if ($request->hasFile('ktp')) {
                // Delete the old ktp image
                if ($penghuni->ktp) {
                    Storage::disk('public')->delete($penghuni->ktp);
                }

                $ktpPath = $request->file('ktp')->store('ktp_images', 'public');
                $validated['ktp'] = $ktpPath;
            }

            $penghuni->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Penghuni updated successfully',
                'data' => $penghuni,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating penghuni: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update penghuni',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $penghuni = Penghuni::findOrFail($id);

            // Delete the ktp image
            if ($penghuni->ktp) {
                Storage::disk('public')->delete($penghuni->ktp);
            }

            $penghuni->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Penghuni deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting penghuni: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete penghuni',
            ], 500);
        }
    }
}
