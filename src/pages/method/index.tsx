import React from "react";
import PageFrame from "@/components/layout/PageFrame";
import MethodView from "@/components/patternTrack/MethodView";

export default function MethodPage() {
  return (
    <PageFrame title="Method" subtitle="How to study each day, what to memorize, and what to skip.">
      <MethodView />
    </PageFrame>
  );
}
