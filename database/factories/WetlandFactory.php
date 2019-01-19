<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Wetland::class, function (Faker $faker) {
    return [
        'nature' => $faker->name,
        'name' => $faker->url,
        'location' => $faker->phoneNumber,
        'area' => $faker->url,
        'flora' => $faker->name,
        'fauna' => $faker->phoneNumber,
        'remarks' => $faker->url,
    ];
});
