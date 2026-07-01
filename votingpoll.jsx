import { useState, useEffect } from "react";

const OPTIONS = [
  { id: "f1", label: "Formula 1", color: "#E10600" },
  { id: "wrc", label: "WRC", color: "#00A651" },
  { id: "endurance", label: "Endurance", color: "#0057B8" },
];

export default function VotingPoll() {
  // Start with 0s since we will load the real numbers from Python
  const [votes, setVotes] = useState({ f1: 0, wrc: 0, endurance: 0 });
  const [voted, setVoted] = useState(null);

  // 1. GET THE LIVE DATA WHEN THE PAGE LOADS
  useEffect(() => {
    fetch("https://backend-voting-app-25f8.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setVotes({
          f1: data.f1.votes,
          wrc: data.wrc.votes, 
          endurance: data.endurance.votes,
        });
      })
      .catch((err) => console.error("Error connecting to Python backend:", err));
  }, []);

  // Calculate totals based on live values
  const total = Object.values(votes).reduce((sum, v) => sum + v, 0);

  // 2. SEND THE VOTE TO THE BACKEND 
  const handleVote = (id) => { 
    if (voted) return; 

    //  Change it to this:
    fetch(`https://backend-voting-app-25f8.onrender.com/poll/${disciplineId}/vote`, {
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
      // Just set the whole state to the updated data your Python code sent back
      setDisciplines(data); 
    });
        setVoted(id);
      })
      .catch((err) => console.error("Error submitting vote:", err));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Live Poll
        </div>
        <h1 className="mb-6 text-2xl font-bold text-white">
          Best Motorsport Discipline?
        </h1>

        <div className="space-y-4">
          {OPTIONS.map(({ id, label, color }) => {
            const count = votes[id];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isSelected = voted === id;

            return (
              <button
                key={id}
                onClick={() => handleVote(id)}
                disabled={!!voted}
                className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-neutral-600 bg-neutral-800"
                    : "border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-850"
                } ${voted && !isSelected ? "opacity-60" : ""} ${
                  voted ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-white">{label}</span>
                    {isSelected && (
                      <span className="rounded-full bg-neutral-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-300">
                        Your vote
                      </span>
                    )}
                  </div>
                  <span className="text-sm tabular-nums text-neutral-400">
                    {count} votes
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>

                <div className="mt-1 text-right text-xs tabular-nums text-neutral-500">
                  {pct}%
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-neutral-500">
          <span>{total} total votes</span>
          {voted && <span>Thanks for voting 🏁</span>}
        </div>
      </div>
    </div>
  );
}
