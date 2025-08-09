'use client';
import { useState, useEffect } from 'react';

export default function AutomodPage({
  params,
}: {
  params: { guildId: string };
}) {
  const [config, setConfig] = useState<any>(null);
  useEffect(() => {
    fetch(`/api/guilds/${params.guildId}/automod-config`)
      .then((r) => r.json())
      .then(setConfig);
  }, [params.guildId]);
  if (!config) return <div>Loading...</div>;
  return (
    <div>
      <h1>Automod Config</h1>
      <label>
        Enabled
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
        />
      </label>
      <button
        onClick={() =>
          fetch(`/api/guilds/${params.guildId}/automod-config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
          })
        }
      >
        Save
      </button>
    </div>
  );
}
