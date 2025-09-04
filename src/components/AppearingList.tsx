import React, { type ComponentPropsWithoutRef, type ReactNode, useEffect, useState, Children } from "react";

export default function AppearingList({
  visible,
  interval = 75,
  children,
  ...wrapperProps
}: {
  visible: boolean;
  interval?: number;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">) {
  // Always flatten children into an array
  const childrenArray = Children.toArray(children);

  const [visibilityStates, setVisibilityStates] = useState(
    Array(childrenArray.length).fill(false)
  );

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const order = visible
      ? [...childrenArray.keys()].reverse()
      : [...childrenArray.keys()];

    order.forEach((i, idx) => {
      const timeoutId = setTimeout(() => {
        setVisibilityStates((prev) => {
          const copy = [...prev];
          copy[i] = visible;
          return copy;
        });
      }, idx * interval);

      timeouts.push(timeoutId);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [visible, childrenArray.length, interval]);

  return (
    <div {...wrapperProps} style={{ pointerEvents: visible ? "auto" : "none" }}>
      {childrenArray.map((child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              // Pass visible down
              // @ts-expect-error AppearingContent prop
              visible: visibilityStates[idx],
              key: idx,
            })
          : child
      )}
    </div>
  );
}
