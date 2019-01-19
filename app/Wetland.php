<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Wetland extends Model
{
    protected $fillable = [
        'pic_url', 'nature', 'name', 'location', 'area', 'flora', 'fauna', 'remarks'
    ];
}
