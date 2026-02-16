export default function Home() {
  const mockChats = [
    { id: 1, phone: "+48 600 000 000", status: "Umówiono wizytę", time: "10:15" },
    { id: 2, phone: "+48 700 111 222", status: "W trakcie rozmowy", time: "10:45" },
  ];

  return (
    <main className="flex min-h-screen bg-gray-50 text-slate-900">
      {/* Sidebar lewy */}
      <div className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-8 italic">iSubtext</h1>
        <nav className="space-y-4">
          <div className="text-blue-400 font-semibold underline">Dashboard</div>
          <div className="hover:text-blue-300 cursor-pointer">Kalendarz</div>
          <div className="hover:text-blue-300 cursor-pointer">Ustawienia AI</div>
        </nav>
      </div>

      {/* Główna zawartość */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Ostatnie interakcje</h2>
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">AI Online</span>
        </header>

        <div className="grid gap-4">
          {mockChats.map((chat) => (
            <div key={chat.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-mono font-bold text-lg">{chat.phone}</p>
                <p className="text-gray-500 text-sm">Ostatnia wiadomość: {chat.time}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-lg text-sm ${chat.status === 'Umówiono wizytę' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {chat.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}