<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Category</title>
</head>

<body>
    <h2>Danh sach san pham</h2>
    <table border="1" cellpadding="10">
        <thead>
            <tr>
            <tr>
                <th>Ten san pham</th>
                <th>Trang thai</th>
            </tr>
            </tr>
        </thead>
        <tbody>
            @foreach ($category as $category)
                <tr>
                    <td>{{ $category->name }}</td>
                    <td>{{ $category->status }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
