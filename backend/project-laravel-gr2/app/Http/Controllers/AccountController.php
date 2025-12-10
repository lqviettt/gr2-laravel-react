<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index()
    {
        $account = User::all();

        return $this->sendSuccess($account);
    }

    public function show($id)
    {
        $account = User::find($id);

        if (!$account) {
            return $this->sendError('Account not found', 404);
        }

        return $this->sendSuccess($account);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'user_name' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $account = User::create($validatedData);

        return $this->sendSuccess($account, 'Account created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $account = User::find($id);

        if (!$account) {
            return $this->sendError('Account not found', 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'user_name' => 'sometimes|required|string|max:255|unique:users,user_name,' . $id,
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:6',
        ]);

        $account->update($validatedData);

        return $this->sendSuccess($account, 'Account updated successfully');
    }

    public function destroy($id)
    {
        $account = User::find($id);

        if (!$account) {
            return $this->sendError('Account not found', 404);
        }

        $account->delete();

        return $this->sendSuccess([], 'Account deleted successfully');
    }
}
