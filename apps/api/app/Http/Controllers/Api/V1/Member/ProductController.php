<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['seller', 'community'])->where('status', 'active');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $products = $query->latest()->paginate($request->get('per_page', 15));
        return $this->paginatedResponse($products);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with(['seller', 'community'])->findOrFail($id);
        return $this->successResponse($product);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string|max:50',
            'stock' => 'required|integer|min:0',
            'community_id' => 'nullable|exists:communities,id',
        ]);

        $product = Product::create([
            ...$validated,
            'seller_id' => $request->user()->id,
            'status' => 'active',
        ]);

        return $this->successResponse($product, 'Produk berhasil dibuat', 201);
    }

    public function myProducts(Request $request): JsonResponse
    {
        $products = Product::where('seller_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($products);
    }

    public function toggleWishlist(Request $request, int $id): JsonResponse
    {
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $id)
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->successResponse(null, 'Dihapus dari wishlist');
        }

        Wishlist::create(['user_id' => $request->user()->id, 'product_id' => $id]);
        return $this->successResponse(null, 'Ditambahkan ke wishlist', 201);
    }

    public function myWishlist(Request $request): JsonResponse
    {
        $items = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($request->get('per_page', 15));

        return $this->paginatedResponse($items);
    }
}
