"use client";

import { Button } from "@/components/ui/button";

export default function CreateLaneButton() {
  return (
    <Button
      variant={"default"}
      onClick={() => {
        console.log("Create lane");
      }}
    >
      Create lane
    </Button>
  );
}
