import React, { useEffect, useState, memo } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const userData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:9000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
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
    <div className="my-account-page p-4">
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
          <p className="text-lg">Email: {user.email}</p>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading user information...</p>
      )}
    </div>
  );
};

export default memo(ProfilePage);
