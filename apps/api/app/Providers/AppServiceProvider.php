<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Article;
use App\Models\Brand;
use App\Models\Collaboration;
use App\Models\Community;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use App\Policies\ArticlePolicy;
use App\Policies\BrandPolicy;
use App\Policies\CollaborationPolicy;
use App\Policies\CommunityPolicy;
use App\Policies\EventPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        Community::class => CommunityPolicy::class,
        Event::class => EventPolicy::class,
        Organization::class => OrganizationPolicy::class,
        Brand::class => BrandPolicy::class,
        Collaboration::class => CollaborationPolicy::class,
        Article::class => ArticlePolicy::class,
        User::class => UserPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->input('email').'|'.$request->ip());
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('register', function (Request $request) {
            return Limit::perMinute(3)->by($request->ip());
        });
    }
}
