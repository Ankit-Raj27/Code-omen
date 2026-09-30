import React from "react";
import { METHOD_SECTIONS, METHOD_SOURCES } from "@/content/method";
import { Panel } from "./ui";

const MethodView: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {METHOD_SECTIONS.map((s) => (
      <Panel key={s.title}>
        <h3 className="mb-2 font-medium text-dark-gray-8">{s.title}</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-dark-label-2">
          {s.items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </Panel>
    ))}
    <Panel className="md:col-span-2">
      <h3 className="mb-2 font-medium text-dark-gray-8">Sources</h3>
      <ul className="space-y-1 text-sm">
        {METHOD_SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer" className="text-dark-blue-s hover:underline">{s.title}</a>
          </li>
        ))}
      </ul>
    </Panel>
  </div>
);

export default MethodView;
