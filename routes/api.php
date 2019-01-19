<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'AuthController@login');
});

Route::group(['middleware' => 'jwt.auth'], function ($router) {
    //user controller routes
    Route::get('/users/all', 'UserController@all');
    Route::post('/user/new', 'UserController@add');
    Route::get('/user/{id}/view', 'UserController@view');
    Route::post('/user/{id}/edit', 'UserController@edit');
    Route::post('/user/profile', 'UserController@editProfile');
    Route::get('/user/{id}/delete', 'UserController@delete');
    Route::post('/user/activity', 'UserActivityController@add');
    Route::get('/user/activities/{id}/delete', 'UserActivityController@delete');
    
    Route::get('/check-superadmin/{id}', 'UserController@checkSuperAdmin');
    //unique email check
    Route::get('/check-email/{email}', 'UserController@checkEmail');

    //wetland controller routes
    Route::get('/wetlands/all', 'WetlandController@all');
    Route::post('/wetland/new', 'WetlandController@add');
    Route::get('/wetland/{id}/view', 'WetlandController@view');
    Route::post('/wetland/{id}/edit', 'WetlandController@edit');
    Route::get('/wetland/{id}/delete', 'WetlandController@delete');
    
    //post controller routes
    Route::get('/posts/all', 'PostController@all');
    Route::post('/post/new', 'PostController@add');
    Route::post('/post/{id}/edit', 'PostController@edit');
    Route::get('/post/{id}/view', 'PostController@view');
    Route::get('/post/{id}/delete', 'PostController@delete');

});

//Guest post
Route::get('/guest/posts/all', 'PostController@all');
Route::get('/guest/post/{id}/view', 'PostController@view');

//Guest wetland
Route::get('/guest/wetlands/all', 'WetlandController@all');
Route::get('/guest/wetland/{id}/view', 'WetlandController@view');