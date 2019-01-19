<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Image;
use App\Http\Requests\UserRequest;

class UserController extends Controller
{
    public function all() {
        $allUsers = DB::table('users')
                        ->orderBy('name', 'asc')
                        ->get();

        return response()->json([
            "users" => $allUsers
        ]);
    }

    public function add(UserRequest $request) {
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ? $request->role : 'observer',
        ];
        $user = User::create($userData);
        return response()->json([
            'user' => $user,
        ]);
    }

    public function view($id) {
        $user = User::findOrFail($id);
        $userActivities = User::find($id)->user_activities;
        return response()->json([
            'user' => $user,
            'userActivities' => $userActivities,
        ]);
    }

    public function edit(Request $request, $id) {
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];
        $update = User::where('id', '=', $id)
                        ->update($updateData);
        
        $update_password = $this->change_password($request);

        if($update || $update_password) {
            $user = User::findOrFail($id);
            return response()->json([
                'updatedUser' => $user,
                'updatePassword' => $update_password
            ]);
        }
    }


    public function editProfile(Request $request) {

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];
        $update = User::where('id', '=', $request->id)
                        ->update($updateData);
        $update_password = $this->change_password($request);
        $save_image = $this->save_image($request);
        if($update || $update_password || $save_image) {
            $user = User::findOrFail($request->id);
            
                return response()->json([
                    'updatedProfile' => $user,
                    'update_status' => $update,
                    'updatePassword' => $update_password
                ], 200);
            
        }

    }

    public function delete($id) {
        $delete = User::where('id', '=', $id)
                        ->delete();
        if($delete) {
            return response()->json([
                'softDeletedUser' => $delete
            ]);
        }
    }

    public function checkEmail(Request $request, $email) {
        $hasEmail = User::where('email', '=', $email)->exists();
        $getData = User::where('email', '=', $email)->first();
        
        return response()->json([
            'hasEmail' => $hasEmail,
            'user' => $getData
        ]);
    }

    public function checkSuperAdmin($id) {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }

    private function save_image($request) {
        if( $request->hasFile('profile_picture')) {
            $image = $request->file('profile_picture');
            
            $image_name = 'user-'.$request->id.'-'.time().
                            '.'.$image->getClientOriginalExtension();
            
            $image_path = $_SERVER['DOCUMENT_ROOT'].'/uploads/users/'.$image_name;
            
            $image_obj = Image::make($image);
            
            $saveImage = $image_obj->resize(200, 200)->save($image_path);
            if($saveImage) {
                $update_profile_picture = User::where('id', '=', $request->id)
                      ->update([
                            'profile_picture' => '/uploads/users/'.$image_name,
                      ]);
                return true;
            }
        }
    }

    private function change_password($request) {
        if(isset($request->password) &&
           !empty($request->password) &&
           $request->password != 'undefined' &&
           $request->password != null) {
            $update_pass = User::where('id', '=', $request->id)
                                 ->update([
                                    'password' => bcrypt($request->password),  
                                 ]);
            return true;
        }
        return false;
    }
}
