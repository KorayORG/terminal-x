'use client';
import { useEffect, useState } from 'react';

export default function AnnouncementsPage({
  params,
}: {
  params: { guildId: string };
}) {
  const [items, setItems] = useState<any[]>([]);
  const [channelId, setChannelId] = useState('');
  const [content, setContent] = useState('');

  async function load() {
    const res = await fetch(`/api/guilds/${params.guildId}/announcements`);
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [params.guildId]);

  return (
    <div>
      <h1>Announcements</h1>
      <ul>
        {items.map((a) => (
          <li key={a.id}>{a.content || a.templateId}</li>
        ))}
      </ul>
      <div>
        <input
          placeholder="Channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
        <input
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={async () => {
            await fetch(`/api/guilds/${params.guildId}/announcements`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ channelId, content }),
            });
            setChannelId('');
            setContent('');
            await load();
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
