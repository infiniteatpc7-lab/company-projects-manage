<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Client;
use App\Models\Project;
use App\Models\Domain;
use App\Models\Server;
use App\Models\Amc;

class GlobalSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_search()
    {
        $response = $this->getJson('/search?q=test');
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_search_clients_and_others()
    {
        $user = User::factory()->create();

        $client = new Client();
        $client->company_name = 'ACME Corp';
        $client->contact_person = 'John Doe';
        $client->email = 'contact@acme.com';
        $client->phone = '1234567890';
        $client->city = 'New York';
        $client->country = 'USA';
        $client->save();

        $project = new Project();
        $project->name = 'ACME Website';
        $project->client_id = $client->id;
        $project->status = 'Active';
        $project->save();

        $domain = new Domain();
        $domain->domain_name = 'acme.com';
        $domain->client_id = $client->id;
        $domain->registrar = 'GoDaddy';
        $domain->status = 'Active';
        $domain->managed_by = 'Client';
        $domain->save();

        $server = new Server();
        $server->name = 'ACME Prod Server';
        $server->provider = 'AWS';
        $server->client_id = $client->id;
        $server->status = 'Active';
        $server->managed_by = 'Client';
        $server->save();

        $amc = new Amc();
        $amc->title = 'ACME Annual Maintenance';
        $amc->client_id = $client->id;
        $amc->amount = 1000;
        $amc->status = 'Active';
        $amc->start_date = '2025-01-01';
        $amc->next_due_date = '2026-12-31';
        $amc->save();

        // Search for ACME (case insensitive)
        $response = $this->actingAs($user)->getJson('/search?q=acme');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'clients',
            'projects',
            'domains',
            'servers',
            'amcs'
        ]);

        $data = $response->json();
        
        $this->assertCount(1, $data['clients']);
        $this->assertEquals('ACME Corp', $data['clients'][0]['title']);

        $this->assertCount(1, $data['projects']);
        $this->assertEquals('ACME Website', $data['projects'][0]['title']);

        $this->assertCount(1, $data['domains']);
        $this->assertEquals('acme.com', $data['domains'][0]['title']);

        $this->assertCount(1, $data['servers']);
        $this->assertEquals('ACME Prod Server', $data['servers'][0]['title']);

        $this->assertCount(1, $data['amcs']);
        $this->assertEquals('ACME Annual Maintenance', $data['amcs'][0]['title']);
    }
    
    public function test_empty_search_returns_empty_results_without_querying()
    {
        $user = User::factory()->create();

        $client = new Client();
        $client->company_name = 'Test Client';
        $client->contact_person = 'Test Person';
        $client->email = 'test@test.com';
        $client->phone = '123123123';
        $client->city = 'City';
        $client->country = 'Country';
        $client->save();

        $response = $this->actingAs($user)->getJson('/search?q=');
        
        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertEmpty($data['clients']);
        $this->assertEmpty($data['projects']);
    }
}
