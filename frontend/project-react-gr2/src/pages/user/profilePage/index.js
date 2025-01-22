import React, { useEffect, useState, memo } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const userData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:9000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Sử dụng Bearer Token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    userData();
  }, []);

  return (
    <div className="my-account-page">
      {user ? (
        <div>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Username: {user.user_name}</p>
          {/* Thêm các thông tin khác nếu cần */}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default memo(ProfilePage);
