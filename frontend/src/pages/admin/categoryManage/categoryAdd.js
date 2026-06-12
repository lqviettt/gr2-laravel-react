import React, { useState, useEffect } from "react";
import axios from "axios";
import { memo } from "react";

const CategoryManageAdd = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post("/api/categories", {
        name: newCategory,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

  return (
    <div>
      <h1>Category Add</h1>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="New Category"
      />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleDeleteCategory(category.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default memo(CategoryManageAdd);
