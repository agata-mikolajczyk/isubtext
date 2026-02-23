export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl mb-8">Privacy Policy</h1>

      <p className="mb-6">Last updated: 2026-02-23</p>

      <p>
        iSubtext respects your privacy. Conversations submitted to the service
        are processed only to generate an insight and are not stored.
      </p>

      <h2 className="mt-8 mb-2 font-medium">Data Processing</h2>
      <p>
        Conversation text is processed transiently in memory solely to generate
        the requested reflection. No conversation data is stored or logged by
        iSubtext.
      </p>

      <h2 className="mt-8 mb-2 font-medium">Stored Data</h2>
      <p>
        If reflections are saved in the future, only minimal data necessary to
        provide the service will be stored.
      </p>

      <h2 className="mt-8 mb-2 font-medium">AI Processing</h2>
      <p>
        iSubtext uses third-party AI infrastructure to generate insights. Text is
        processed only to produce responses.
      </p>

      <h2 className="mt-8 mb-2 font-medium">Contact</h2>
      <p>contact@isubtext.com</p>
    </main>
  );
}
