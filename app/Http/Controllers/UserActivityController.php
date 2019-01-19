<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UserActivity;

class UserActivityController extends Controller
{
    public function add(Request $request) {
        $insert = [
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'desc' => nl2br($request->desc),
        ];
        $activity = UserActivity::create($insert);
        return response()->json([
            'activity' => $activity,
        ]);
    }

    public function delete($id) {
        $delete = UserActivity::where('user_id', '=', $id)
                        ->delete();
        
            return response()->json([
                'deleted' => $delete
            ]);
        
    }
}
