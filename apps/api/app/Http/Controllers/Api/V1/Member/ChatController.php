<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Member;

use App\Http\Controllers\Controller;
use App\Models\ChatThread;
use App\Models\ChatMessage;
use App\Models\CommunityMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function threads(Request $request): JsonResponse
    {
        $communityIds = CommunityMember::where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->pluck('community_id');

        $threads = ChatThread::whereIn('community_id', $communityIds)
            ->with('community')
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->paginatedResponse($threads);
    }

    public function messages(Request $request, int $threadId): JsonResponse
    {
        $thread = ChatThread::findOrFail($threadId);

        $messages = ChatMessage::with('user')
            ->where('thread_id', $threadId)
            ->orderBy('created_at', 'asc')
            ->paginate($request->get('per_page', 50));

        return $this->paginatedResponse($messages);
    }

    public function send(Request $request, int $threadId): JsonResponse
    {
        $thread = ChatThread::findOrFail($threadId);

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $message = ChatMessage::create([
            'thread_id' => $threadId,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
        ]);

        return $this->successResponse($message->load('user'), 'Pesan terkirim', 201);
    }
}
