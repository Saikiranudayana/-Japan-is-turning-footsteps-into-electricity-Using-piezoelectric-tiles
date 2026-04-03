"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Failed to initiate login");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">StepSync</h1>
          <p className="text-gray-400 text-lg">
            Visualize your daily steps as a GitHub-style contribution heatmap
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10 text-sm text-gray-400">
          <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="text-2xl mb-1">📊</div>
            <p>Step Heatmap</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="text-2xl mb-1">🤖</div>
            <p>AI Insights</p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)]">
            <div className="text-2xl mb-1">📈</div>
            <p>Track Progress</p>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Login with Google
        </button>

        <p className="mt-6 text-xs text-gray-500">
          We only access your Google Fit step count data. Nothing else.
        </p>
      </div>
    </main>
  );
}
