<?php

namespace App\Http\Controllers;

use App\Wetland;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Image;

class WetlandController extends Controller
{
    public function all() {
        $allWetlands = DB::table('wetlands')
                           ->orderBy('name', 'asc')
                           ->get();

        return response()->json([
            "wetlands" => $allWetlands
        ]);
    }

    public function add(Request $request) {

        $save_image = $this->save_image($request, '', 'add');

        $insertData = [
            'pic_url' => $save_image,
            'nature' => $request->nature,
            'name' => $request->name,
            'location' => $request->location,
            'area' => $request->area,
            'flora' => $request->flora,
            'fauna' => $request->fauna,
            'remarks' => $request->remarks,
        ];
        
        $wetland = Wetland::create($insertData);

        if($wetland) {
            return response()->json([
                'wetland' => $wetland,
            ]);
        }
    }

    public function view($id) {
        $wetland = Wetland::findOrFail($id);
        return response()->json([
            'wetland' => $wetland
        ]);
    }

    public function edit(Request $request, $id) {


        $updateData = [
            'nature' => $request->nature,
            'name' => $request->name,
            'location' => $request->location,
            'area' => $request->area,
            'flora' => $request->flora,
            'fauna' => $request->fauna,
            'remarks' => $request->remarks,
        ];
        
        $update = Wetland::where('id', '=', $id)
                        ->update($updateData);
        
        $save_image = $this->save_image($request, $id, 'update');

        if($update || $save_image) {
            $wetland = Wetland::findOrFail($id);
            return response()->json([
                'updatedWetland' => $wetland
            ]);
        }
    }

    public function delete($id) {
        $delete = Wetland::where('id', '=', $id)
                        ->delete();
        if($delete) {
            return response()->json([
                'deletedWetland' => $delete
            ]);
        }
    }



    private function save_image($request, $id, $operation) {
        if( $request->hasFile('wetland_pic')) {
            $image = $request->file('wetland_pic');
            
            $image_name = 'wetland-'.$id.'-'.time().
                            '.'.$image->getClientOriginalExtension();
            
            $image_path = $_SERVER['DOCUMENT_ROOT'].'/uploads/wetlands/'.$image_name;
            
            $image_obj = Image::make($image);
            
            $saveImage = $image_obj->save($image_path);
            if($saveImage) {
                if($operation == 'add') {
                    $pic_url = '/uploads/wetlands/'.$image_name;
                    return $pic_url;
                }elseif($operation == 'update') {
                    $update_wetland_pic = Wetland::where('id', '=', $id)
                        ->update([
                                'pic_url' => '/uploads/wetlands/'.$image_name,
                        ]);
                    return true;
                }
            }
        }
    }
}
