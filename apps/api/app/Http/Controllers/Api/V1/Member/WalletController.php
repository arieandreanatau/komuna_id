<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function balance(Request $request): JsonResponse
    {
        $wallet = Wallet::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['balance' => 0, 'currency' => 'IDR', 'status' => 'active']
        );

        return $this->successResponse([
            'balance' => $wallet->balance,
            'currency' => $wallet->currency,
        ]);
    }

    public function transactions(Request $request): JsonResponse
    {
        $wallet = Wallet::where('user_id', $request->user()->id)->first();

        if (! $wallet) {
            return $this->successResponse(['data' => []]);
        }

        $transactions = WalletTransaction::where('wallet_id', $wallet->id)
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->paginatedResponse($transactions);
    }

    public function topUp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:10000|max:10000000',
        ]);

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['balance' => 0, 'currency' => 'IDR', 'status' => 'active']
        );

        $wallet->increment('balance', $validated['amount']);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'amount' => $validated['amount'],
            'type' => 'credit',
            'description' => 'Top up saldo',
            'status' => 'completed',
        ]);

        return $this->successResponse([
            'balance' => $wallet->fresh()->balance,
        ], 'Top up berhasil');
    }
}
