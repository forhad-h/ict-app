<?php

namespace App\Http\Controllers;

use App\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Image;

class PostController extends Controller
{
    public function all() {
        $allPosts = DB::table('posts')
                        ->orderBy('id', 'desc')
                        ->get();

        return response()->json([
            "posts" => $allPosts
        ]);
    }

    public function add(Request $request) {
        $save_image = $this->save_image($request, '', 'add');
        
        $insertData = [
            'pic_url' => $save_image,
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'title' => $request->title,
            'description' => $request->description,
        ];

        $post = Post::create($insertData);

        if($post) {
            return response()->json([
                'post' => $post,
            ]);
        }
    }

    public function view($id) {
        $post = Post::findOrFail($id);
        return response()->json([
            'post' => $post
        ]);
    }

    public function edit(Request $request, $id) {

        $updatetData = [
            'user_id' => $request->user_id,
            'user_name' => $request->user_name,
            'title' => $request->title,
            'description' => $request->description,
        ];

        $update = Post::where('id', '=', $id)
                        ->update($updatetData);

        $save_image = $this->save_image($request, $id, 'update');
        
        if($update || $save_image) {
            $post = Post::findOrFail($id);
            return response()->json([
                'updatedPost' => $post
            ]);
        }
    }

    public function delete($id) {
        $delete = Post::where('id', '=', $id)
                        ->delete();
        if($delete) {
            return response()->json([
                'deletedPost' => $delete
            ]);
        }
    }


    private function save_image($request, $id, $operation) {
        if( $request->hasFile('feature_image')) {
            $image = $request->file('feature_image');
            
            $image_name = 'post-'.$id.'-'.time().
                            '.'.$image->getClientOriginalExtension();
            
            $image_path = $_SERVER['DOCUMENT_ROOT'].'/uploads/posts/'.$image_name;
            
            $image_obj = Image::make($image);
            
            $saveImage = $image_obj->save($image_path);
            if($saveImage) {
                if($operation == 'add') {
                    $pic_url = '/uploads/posts/'.$image_name;
                    return $pic_url;
                }elseif($operation == 'update') {
                    $update_feature_image = Post::where('id', '=', $id)
                        ->update([
                                'pic_url' => '/uploads/posts/'.$image_name,
                        ]);
                    return true;
                }
            }
        }
    }
}
