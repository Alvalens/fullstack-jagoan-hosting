<?php

namespace App\Http\Controllers;

use App\Models\Penghuni;
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
}
