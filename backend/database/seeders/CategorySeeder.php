<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'RAVOK INSIGHTS', 'slug' => 'ravok-insights', 'description' => null],
            ['name' => 'Latest Analysis', 'slug' => 'latest-analysis', 'description' => null],
            ['name' => 'Creator Stories', 'slug' => 'creator-stories', 'description' => null],
            ['name' => 'Data & Research', 'slug' => 'data-research', 'description' => null],
        ];

        foreach ($categories as $item) {
            Category::firstOrCreate(
                ['slug' => $item['slug']],
                ['name' => $item['name'], 'description' => $item['description']]
            );
        }
    }
}
