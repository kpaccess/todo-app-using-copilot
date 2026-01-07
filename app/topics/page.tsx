"use client";
import React, { useState } from "react";
import TopicPicker from "@/components/TopicPicker";

export default function TopicsPage() {
  const [todos, setTodos] = useState<any[]>([]);

  const handleAddTopic = (newTodo: any) => {
    setTodos((prev) => [...prev, newTodo]);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Browse Topics</h1>
      <TopicPicker onAddTopic={handleAddTopic} />

      {todos.length > 0 && (
        <div>
          <h2 className="text-xl font-medium mt-6">Recently added</h2>
          <ul className="list-disc pl-6">
            {todos.map((todo) => (
              <li key={todo.id}>{todo.task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
