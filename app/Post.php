<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id', 'user_name', 'title', 'pic_url', 'description'
    ];
}
