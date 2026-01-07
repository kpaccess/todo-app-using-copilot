import React, { useEffect, useState } from 'react';

interface TopicPickerProps {
  onAddTopic?: (newTodo: any) => void;
}

interface PredefinedTopic {
  id: string;
  title: string;
  description?: string | null;
}

const TopicPicker: React.FC<TopicPickerProps> = ({ onAddTopic }) => {
  const [topics, setTopics] = useState<PredefinedTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/predefined-topics');
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleAdd = async (topicId: string) => {
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      });

      if (response.ok) {
        const newTodo = await response.json();
        onAddTopic?.(newTodo);
        // Optional: navigate to detail page for this topic
        try {
          const topic = topics.find(t => t.id === topicId);
          if (topic?.title) {
            window.location.assign(`/topics/${encodeURIComponent(topic.title)}`);
          }
        } catch {}
      } else {
        console.error('Failed to add topic to todo list');
      }
    } catch (error) {
      console.error('Error adding topic to todo list:', error);
    }
  };

  if (loading) {
    return <p>Loading topics...</p>;
  }

  return (
    <div>
      <h2>Pick a Topic</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <span>{topic.title}</span>
            <button onClick={() => handleAdd(topic.id)}>Add to Todo</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicPicker;