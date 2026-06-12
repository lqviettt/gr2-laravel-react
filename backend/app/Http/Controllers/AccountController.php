<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    /**
     * Display a listing of accounts with pagination and search
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('perPage', 15);
            $search = $request->input('search', '');
            $status = $request->input('status', '');

            $query = User::query();

            // Search by name, email, or username
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('user_name', 'like', "%{$search}%");
                });
            }

            // Filter by status (is_admin)
            if ($status === 'admin') {
                $query->where('is_admin', true);
            } elseif ($status === 'user') {
                $query->where('is_admin', false);
            }

            $accounts = $query->paginate($perPage);

            return $this->sendSuccess($accounts);
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving accounts: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display a specific account
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $account = User::findOrFail($id);
            return $this->sendSuccess($account);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendError('Account not found', 404);
        } catch (\Exception $e) {
            return $this->sendError('Error retrieving account: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Store a new account
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'user_name' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'is_admin' => 'sometimes|boolean',
            ]);
            $validatedData['verification_code'] = "abczyx";

            $account = User::create($validatedData);

            return $this->created($account, 'Tạo tài khoản thành công');
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = [];
            foreach ($e->errors() as $field => $messages) {
                $errors = array_merge($errors, $messages);
            }
            return response()->json([
                'status' => 422,
                'error' => implode(', ', $errors)
            ], 422);
        } catch (\Exception $e) {
            return $this->sendError('Có lỗi khi tạo tài khoản: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update an existing account
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $account = User::findOrFail($id);

            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'user_name' => 'sometimes|required|string|max:255|unique:users,user_name,' . $id,
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:6',
                'is_admin' => 'sometimes|boolean',
            ]);

            $account->update($validatedData);

            return $this->sendSuccess($account, 'Cập nhật tài khoản thành công');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendError('Account not found', 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            $errors = [];
            foreach ($e->errors() as $field => $messages) {
                $errors = array_merge($errors, $messages);
            }
            return response()->json([
                'status' => 422,
                'error' => implode(', ', $errors)
            ], 422);
        } catch (\Exception $e) {
            return $this->sendError('Có lỗi xảy ra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete an account
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $account = User::findOrFail($id);
            
            // Prevent deleting the only admin account (optional safety check)
            if ($account->is_admin && User::where('is_admin', true)->count() <= 1) {
                return $this->sendError('Cannot delete the last admin account', 400);
            }

            $account->delete();

            return $this->sendSuccess([], 'Account deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendError('Account not found', 404);
        } catch (\Exception $e) {
            return $this->sendError('Error deleting account: ' . $e->getMessage(), 500);
        }
    }
}
