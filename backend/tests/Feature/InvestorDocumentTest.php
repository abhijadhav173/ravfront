<?php

namespace Tests\Feature;

use App\Models\DocumentCategory;
use App\Models\InvestorDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InvestorDocumentTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $investor;
    private User $pendingInvestor;
    private DocumentCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_APPROVED,
        ]);

        $this->investor = User::create([
            'name' => 'Investor',
            'email' => 'investor@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_INVESTOR,
            'status' => User::STATUS_APPROVED,
        ]);

        $this->pendingInvestor = User::create([
            'name' => 'Pending',
            'email' => 'pending@test.com',
            'password' => bcrypt('password'),
            'role' => User::ROLE_INVESTOR,
            'status' => User::STATUS_PENDING,
        ]);

        $this->category = DocumentCategory::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    public function test_admin_can_upload_document(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->admin)
            ->postJson('/api/documents', [
                'document_category_id' => $this->category->id,
                'name' => 'Test Doc',
                'description' => 'A test document',
                'files' => [UploadedFile::fake()->create('test.pdf', 100, 'application/pdf')],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'ok')
            ->assertJsonCount(1, 'items');

        $doc = $response->json('items.0');
        $this->assertNotEmpty($doc['file_path']);
        $this->assertNotEquals('0', $doc['file_path']);
        $this->assertNotEquals(false, $doc['file_path']);
        $this->assertEquals('application/pdf', $doc['mime_type']);
    }

    public function test_approved_investor_can_list_documents(): void
    {
        InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Visible Doc',
            'description' => 'Should be listed',
            'file_path' => 'investor-docs/fake.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->getJson('/api/documents');

        $response->assertStatus(200)
            ->assertJsonPath('total', 1);
    }

    public function test_approved_investor_can_show_document(): void
    {
        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Detail Doc',
            'description' => 'Show endpoint',
            'file_path' => 'investor-docs/fake.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->getJson("/api/documents/{$doc->id}");

        $response->assertStatus(200)
            ->assertJsonPath('id', $doc->id)
            ->assertJsonPath('name', 'Detail Doc');
    }

    public function test_stream_file_returns_content_for_local_disk(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('stream-test.pdf', 50, 'application/pdf');
        $path = $file->store('investor-docs', 'public');

        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Stream Doc',
            'description' => 'Stream test',
            'file_path' => $path,
            'mime_type' => 'application/pdf',
            'size_bytes' => $file->getSize(),
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->get("/api/documents/{$doc->id}/file");

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf')
            ->assertHeader('Content-Disposition')
            ->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_stream_file_returns_404_for_missing_file(): void
    {
        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Missing File',
            'description' => 'File does not exist',
            'file_path' => 'investor-docs/nonexistent.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->getJson("/api/documents/{$doc->id}/file");

        $response->assertStatus(404);
    }

    public function test_stream_file_returns_404_for_empty_path(): void
    {
        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Empty Path',
            'description' => 'Path is empty',
            'file_path' => '',
            'mime_type' => 'application/pdf',
            'size_bytes' => 0,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->getJson("/api/documents/{$doc->id}/file");

        $response->assertStatus(404);
    }

    public function test_upload_stores_file_with_valid_path(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->admin)
            ->postJson('/api/documents', [
                'document_category_id' => $this->category->id,
                'name' => 'Path Test',
                'description' => 'Verify path is not 0 or false',
                'files' => [UploadedFile::fake()->create('doc.pdf', 200, 'application/pdf')],
            ]);

        $response->assertStatus(201);
        $path = $response->json('items.0.file_path');

        $this->assertIsString($path);
        $this->assertStringStartsWith('investor-docs/', $path);
        $this->assertStringEndsWith('.pdf', $path);
        $this->assertNotEquals('0', $path);
    }

    public function test_upload_then_stream_roundtrip(): void
    {
        Storage::fake('public');

        $upload = $this->actingAs($this->admin)
            ->postJson('/api/documents', [
                'document_category_id' => $this->category->id,
                'name' => 'Roundtrip',
                'description' => 'Upload then stream',
                'files' => [UploadedFile::fake()->create('roundtrip.pdf', 75, 'application/pdf')],
            ]);

        $upload->assertStatus(201);
        $docId = $upload->json('items.0.id');

        $stream = $this->actingAs($this->investor)
            ->get("/api/documents/{$docId}/file");

        $stream->assertStatus(200)
            ->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_admin_can_delete_document(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('delete-me.pdf', 50, 'application/pdf');
        $path = $file->store('investor-docs', 'public');

        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Delete Me',
            'description' => 'To be deleted',
            'file_path' => $path,
            'mime_type' => 'application/pdf',
            'size_bytes' => $file->getSize(),
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/documents/{$doc->id}");

        $response->assertStatus(200)->assertJsonPath('status', 'ok');
        $this->assertDatabaseMissing('investor_documents', ['id' => $doc->id]);
    }

    public function test_pending_investor_cannot_list_documents(): void
    {
        $response = $this->actingAs($this->pendingInvestor)
            ->getJson('/api/documents');

        $response->assertStatus(403);
    }

    public function test_pending_investor_cannot_show_document(): void
    {
        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Hidden',
            'description' => 'Not for pending',
            'file_path' => 'investor-docs/fake.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->pendingInvestor)
            ->getJson("/api/documents/{$doc->id}");

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access_documents(): void
    {
        $this->getJson('/api/documents')->assertStatus(401);
    }

    public function test_investor_cannot_upload(): void
    {
        $response = $this->actingAs($this->investor)
            ->postJson('/api/documents', [
                'document_category_id' => $this->category->id,
                'name' => 'Sneaky Upload',
                'description' => 'Should fail',
                'files' => [UploadedFile::fake()->create('hack.pdf', 10, 'application/pdf')],
            ]);

        $response->assertStatus(403);
    }

    public function test_investor_cannot_delete(): void
    {
        $doc = InvestorDocument::create([
            'document_category_id' => $this->category->id,
            'name' => 'Protected',
            'description' => 'Cannot delete',
            'file_path' => 'investor-docs/fake.pdf',
            'mime_type' => 'application/pdf',
            'size_bytes' => 1000,
            'uploaded_by' => $this->admin->id,
        ]);

        $response = $this->actingAs($this->investor)
            ->deleteJson("/api/documents/{$doc->id}");

        $response->assertStatus(403);
    }
}
