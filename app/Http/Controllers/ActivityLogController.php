<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $perPage = max(1, min(100, $perPage));

        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Activity logs retrieved successfully.',
            'code' => 200,
            'data' => ActivityLogResource::collection($logs)->response()->getData(true)
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActivityLogRequest $request): JsonResponse
    {
        $log = ActivityLog::create(array_merge($request->validated(), [
            'user_id' => auth()->id()
        ]));

        $log->load('user');

        return response()->json([
            'status' => 'success',
            'message' => 'Activity log recorded successfully.',
            'code' => 201,
            'data' => new ActivityLogResource($log)
        ], 201);
    }
}
