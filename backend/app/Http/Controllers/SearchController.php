<?php

namespace App\Http\Controllers;

use App\Models\Penghuni;
use App\Models\Rumah;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function searchPenghuni(Request $request)
    {
        $search = $request->search;
        if ($search) {
            $penghuni = Penghuni::where('nama', 'like', "%" . $search . "%")->get();
        } else {
            $penghuni = Penghuni::all();
        }
        return response()->json($penghuni);
    }

    public function searchRumah(Request $request)
    {
        $search = $request->search;
        if ($search) {
            $rumah = Rumah::where('nama', 'like', "%" . $search . "%")->get();
        } else {
            $rumah = Rumah::all();
        }
        return response()->json($rumah);
    }
}
