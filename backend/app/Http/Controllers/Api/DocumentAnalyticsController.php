<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataRoom;
use App\Models\DocumentPageView;
use App\Models\DocumentView;
use App\Models\InvestorDocument;
use App\Models\RoomVisitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentAnalyticsController extends Controller
{
    public function overview()
    {
        $now = now();
        $week = $now->copy()->subDays(7);
        $month = $now->copy()->subDays(30);

        $totalViews = DocumentView::count();
        $viewsLast7 = DocumentView::where('started_at', '>=', $week)->count();
        $viewsLast30 = DocumentView::where('started_at', '>=', $month)->count();

        $uniqueUsers = DocumentView::whereNotNull('user_id')->distinct('user_id')->count('user_id');
        $uniqueVisitors = DocumentView::whereNotNull('room_visitor_id')->distinct('room_visitor_id')->count('room_visitor_id');
        $totalUniqueViewers = $uniqueUsers + $uniqueVisitors;

        $totalSeconds = (int) DocumentView::sum('total_duration_seconds');

        $topDocs = InvestorDocument::withCount('views')
            ->withSum('views', 'total_duration_seconds')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'name' => $d->original_name ?: $d->name,
                'views' => $d->views_count,
                'total_duration_seconds' => (int) ($d->views_sum_total_duration_seconds ?? 0),
            ]);

        $topRooms = DataRoom::withCount(['visitors', 'views'])
            ->withSum('views', 'total_duration_seconds')
            ->orderByDesc('visitors_count')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'visitors' => $r->visitors_count,
                'views' => $r->views_count,
                'total_duration_seconds' => (int) ($r->views_sum_total_duration_seconds ?? 0),
            ]);

        $topViewers = RoomVisitor::withSum('documentViews', 'total_duration_seconds')
            ->withCount('documentViews')
            ->orderByDesc('document_views_sum_total_duration_seconds')
            ->limit(5)
            ->get()
            ->filter(fn ($v) => ($v->document_views_sum_total_duration_seconds ?? 0) > 0)
            ->values()
            ->map(fn ($v) => [
                'id' => $v->id,
                'name' => $v->name,
                'email' => $v->email,
                'views' => $v->document_views_count,
                'total_duration_seconds' => (int) ($v->document_views_sum_total_duration_seconds ?? 0),
            ]);

        $recentActivity = DocumentView::with('user:id,name,email', 'roomVisitor:id,name,email', 'document:id,name,original_name', 'dataRoom:id,name')
            ->orderByDesc('started_at')
            ->limit(10)
            ->get()
            ->map(function ($v) {
                $name = $v->user?->name ?? $v->roomVisitor?->name ?? 'Unknown';
                $email = $v->user?->email ?? $v->roomVisitor?->email;
                $location = trim(implode(', ', array_filter([$v->city, $v->region, $v->country])));
                return [
                    'id' => $v->id,
                    'viewer_name' => $name,
                    'viewer_email' => $email,
                    'document' => $v->document ? [
                        'id' => $v->document->id,
                        'name' => $v->document->original_name ?: $v->document->name,
                    ] : null,
                    'room' => $v->dataRoom ? ['id' => $v->dataRoom->id, 'name' => $v->dataRoom->name] : null,
                    'location' => $location ?: null,
                    'started_at' => $v->started_at,
                    'total_duration_seconds' => $v->total_duration_seconds,
                ];
            });

        return response()->json([
            'totals' => [
                'views' => $totalViews,
                'views_last_7_days' => $viewsLast7,
                'views_last_30_days' => $viewsLast30,
                'unique_viewers' => $totalUniqueViewers,
                'total_duration_seconds' => $totalSeconds,
            ],
            'top_documents' => $topDocs,
            'top_rooms' => $topRooms,
            'top_viewers' => $topViewers,
            'recent_activity' => $recentActivity,
        ]);
    }

    public function index()
    {
        $documents = InvestorDocument::withCount('views')
            ->with('category')
            ->withSum('views', 'total_duration_seconds')
            ->withMax('views', 'started_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($doc) {
                $uniqueViewers = DocumentView::where('investor_document_id', $doc->id)
                    ->distinct('user_id')
                    ->count('user_id');

                return [
                    'id' => $doc->id,
                    'name' => $doc->original_name ?: $doc->name,
                    'category' => $doc->category?->name,
                    'mime_type' => $doc->mime_type,
                    'created_at' => $doc->created_at,
                    'total_views' => $doc->views_count,
                    'unique_viewers' => $uniqueViewers,
                    'total_duration_seconds' => (int) ($doc->views_sum_total_duration_seconds ?? 0),
                    'last_viewed_at' => $doc->views_max_started_at,
                ];
            });

        return response()->json($documents);
    }

    public function show(InvestorDocument $document)
    {
        $views = DocumentView::where('investor_document_id', $document->id)
            ->with('user:id,name,email')
            ->orderByDesc('started_at')
            ->get()
            ->map(fn ($v) => [
                'id' => $v->id,
                'session_token' => $v->session_token,
                'user' => $v->user ? [
                    'id' => $v->user->id,
                    'name' => $v->user->name,
                    'email' => $v->user->email,
                ] : null,
                'started_at' => $v->started_at,
                'ended_at' => $v->ended_at,
                'total_duration_seconds' => $v->total_duration_seconds,
                'total_pages_viewed' => $v->total_pages_viewed,
                'ip_address' => $v->ip_address,
                'user_agent' => $v->user_agent,
                'location' => $v->city ? trim("{$v->city}, {$v->region}, {$v->country}", ', ') : null,
            ]);

        $pageStats = DocumentPageView::whereHas('documentView', function ($q) use ($document) {
            $q->where('investor_document_id', $document->id);
        })
            ->select('page_number')
            ->selectRaw('COUNT(*) as view_count')
            ->selectRaw('SUM(duration_ms) as total_ms')
            ->selectRaw('AVG(duration_ms) as avg_ms')
            ->groupBy('page_number')
            ->orderBy('page_number')
            ->get();

        $uniqueViewers = DocumentView::where('investor_document_id', $document->id)
            ->distinct('user_id')
            ->count('user_id');

        return response()->json([
            'document' => [
                'id' => $document->id,
                'name' => $document->original_name ?: $document->name,
                'category' => $document->category?->name,
                'mime_type' => $document->mime_type,
                'created_at' => $document->created_at,
            ],
            'summary' => [
                'total_views' => $views->count(),
                'unique_viewers' => $uniqueViewers,
                'total_duration_seconds' => $views->sum('total_duration_seconds'),
                'avg_duration_seconds' => $views->count() > 0
                    ? (int) round($views->avg('total_duration_seconds'))
                    : 0,
            ],
            'views' => $views,
            'page_stats' => $pageStats,
        ]);
    }

    public function viewDetail(string $sessionToken)
    {
        $view = DocumentView::where('session_token', $sessionToken)
            ->with('user:id,name,email', 'document:id,name,original_name')
            ->firstOrFail();

        $pageViews = DocumentPageView::where('document_view_id', $view->id)
            ->orderBy('entered_at')
            ->get()
            ->map(fn ($pv) => [
                'page_number' => $pv->page_number,
                'entered_at' => $pv->entered_at,
                'exited_at' => $pv->exited_at,
                'duration_ms' => $pv->duration_ms,
            ]);

        $pageSummary = DocumentPageView::where('document_view_id', $view->id)
            ->select('page_number')
            ->selectRaw('SUM(duration_ms) as total_ms')
            ->selectRaw('COUNT(*) as visits')
            ->groupBy('page_number')
            ->orderBy('page_number')
            ->get();

        return response()->json([
            'view' => [
                'id' => $view->id,
                'session_token' => $view->session_token,
                'user' => $view->user ? [
                    'id' => $view->user->id,
                    'name' => $view->user->name,
                    'email' => $view->user->email,
                ] : null,
                'document' => [
                    'id' => $view->document->id,
                    'name' => $view->document->original_name ?: $view->document->name,
                ],
                'started_at' => $view->started_at,
                'ended_at' => $view->ended_at,
                'total_duration_seconds' => $view->total_duration_seconds,
                'total_pages_viewed' => $view->total_pages_viewed,
                'ip_address' => $view->ip_address,
                'user_agent' => $view->user_agent,
            ],
            'page_views' => $pageViews,
            'page_summary' => $pageSummary,
        ]);
    }

    public function export(InvestorDocument $document): StreamedResponse
    {
        $filename = 'analytics_'.preg_replace('/[^A-Za-z0-9_-]/', '_', $document->original_name ?: $document->name).'.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        $callback = function () use ($document) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Viewer Name', 'Viewer Email', 'Type', 'Location', 'Started At', 'Ended At', 'Duration (sec)', 'Pages Viewed', 'IP Address']);

            DocumentView::where('investor_document_id', $document->id)
                ->with('user:id,name,email', 'roomVisitor:id,name,email')
                ->orderBy('started_at')
                ->chunk(200, function ($rows) use ($out) {
                    foreach ($rows as $v) {
                        $name = $v->user?->name ?? $v->roomVisitor?->name ?? '';
                        $email = $v->user?->email ?? $v->roomVisitor?->email ?? '';
                        $type = $v->user_id ? 'investor' : ($v->room_visitor_id ? 'room visitor' : 'unknown');
                        $location = trim(implode(', ', array_filter([$v->city, $v->region, $v->country])));
                        fputcsv($out, [
                            $name,
                            $email,
                            $type,
                            $location,
                            $v->started_at,
                            $v->ended_at,
                            $v->total_duration_seconds,
                            $v->total_pages_viewed,
                            $v->ip_address,
                        ]);
                    }
                });
            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }
}
