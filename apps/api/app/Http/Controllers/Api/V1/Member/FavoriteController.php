<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'favorable_type' => 'required|string|in:community,event,article',
            'favorable_id' => 'required|integer',
        ]);

        $exists = Favorite::where('user_id', $request->user()->id)
            ->where('favorable_type', $validated['favorable_type'])
            ->where('favorable_id', $validated['favorable_id'])
            ->exists();

        if ($exists) {
            return $this->errorResponse('Sudah ada di favorit', 422);
        }

        $favorite = Favorite::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return $this->successResponse($favorite, 'Berhasil ditambahkan ke favorit', 201);
    }

    public function index(Request $request): JsonResponse
    {
        $type = $request->get('type');

        $query = Favorite::where('user_id', $request->user()->id);

        if ($type) {
            $query->where('favorable_type', $type);
        }

        $favorites = $query->latest()->paginate($request->get('per_page', 20));

        return $this->paginatedResponse($favorites);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $favorite = Favorite::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $favorite->delete();

        return $this->successResponse(null, 'Berhasil dihapus dari favorit');
    }
}
