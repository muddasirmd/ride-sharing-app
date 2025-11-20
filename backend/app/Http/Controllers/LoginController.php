<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\LoginNeedsVerification;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    public function submit(Request $request){

        // Validate the phone number
        $request->validate(['phone' => 'required|numeric|min:10']);

        // find or create user model
        $user = User::firstOrCreate(['phone' => $request->phone]);

        if(!$user){
            return response()->json(['message' => 'Could not process a user with that phone number.'], 401);
        }

        // send the user a one-time use code
        $user->notify(new LoginNeedsVerification());

        // return response
        return response()->json(['message' => 'Text message notification sent.'], 200);
    }

    public function verify(Request $request){

        // Validate Request
        $request->validate([
            'phone' => 'required|numeric|min:10',
            'login_code'=> 'required|numeric|between:111111,999999'
        ]);

        // Find the user
        $user = User::where('phone', $request->phone)
            ->where('login_code', $request->login_code)->first();
        
        // if provided code matches:
        // set login_code to null in DB
        // return an auth token
        if($user){
            $user->update(['login_code' => null]);

            return $user->createToken($request->login_code)->plainTextToken;
        }

        // if provided code does not match
        return response()->json(['message'=> 'Invalid verification code.'], 401);
    }
}
