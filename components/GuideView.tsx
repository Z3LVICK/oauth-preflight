import { Guide } from "@/lib/type";

export default function GuideView({ guide }: { guide: Guide }) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{guide.appName} OAuth Setup Guide</h1>
        <p className="text-gray-600 mt-2">{guide.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">Difficulty</div>
          <div className="text-xl font-semibold">{guide.difficulty}</div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">First setup</div>
          <div className="text-xl font-semibold">
            {guide.timeToFirstWorkingSetup}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500">Approval wait</div>
          <div className="text-xl font-semibold">{guide.approvalWait}</div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Approval</h2>
        <p className="mb-2">
          {guide.approvalRequired
            ? "Approval or review may be required."
            : "No known approval required."}
        </p>
        <p className="text-gray-700">{guide.approvalSummary}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Requirements</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Known blockers</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.blockers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Setup steps</h2>
        <div className="space-y-4">
          {guide.steps.map((step, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="font-semibold">
                {i + 1}. {step.title}
              </div>
              <p className="text-gray-700 mt-1">{step.detail}</p>
              <div className="text-sm text-gray-500 mt-2">
                Owner: {step.owner}
                {step.time ? ` • Time: ${step.time}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">What the agent can do</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.agentCanDo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">What the human must do</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.humanMustDo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Sources</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {source.title}
              </a>{" "}
              ({source.type})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Uncertainties</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.uncertainties.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tested</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.tested.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Not tested</h2>
        <ul className="list-disc pl-6 space-y-1">
          {guide.notTested.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Confidence</h2>
        <p>{guide.confidence}</p>
      </section>
    </div>
  );
}