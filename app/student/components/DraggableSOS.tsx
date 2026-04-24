"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AlertTriangle, X } from "lucide-react";

const ADMIN_EMAIL = "admin@bwf.edu";
const EDGE_GAP = 24;
const FAB_SIZE = 58;

export default function DraggableSOS() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hasCustomPosition, setHasCustomPosition] = useState(false);

  const triggerSOS = async () => {
    setSending(true);
    try {
      const payload = {
        type: "STUDENT_EMERGENCY",
        message: "Student requested immediate direct escalation to BWF Founder/Admin.",
        createdAt: new Date().toISOString(),
      };

      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      await fetch("/api/student/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      }).catch(() => null);

      const subject = encodeURIComponent("URGENT SOS ALERT - Direct escalation to BWF Founder/Admin");
      const body = encodeURIComponent(
        "This is an emergency SOS alert from a student. Immediate direct action is requested from the BWF Founder/Admin."
      );
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
      setSent(true);
      setHovered(true); // Show success tooltip
      setTimeout(() => {
        setSent(false);
        setHovered(false);
      }, 5000);
      setOpen(false);
    } finally {
      setSending(false);
    }
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

  const getViewport = () => {
    const vv = window.visualViewport;
    const width = vv?.width ?? window.innerWidth;
    const height = vv?.height ?? window.innerHeight;
    return { width, height };
  };

  const getBounds = () => {
    const { width, height } = getViewport();
    return {
      maxX: Math.max(EDGE_GAP, width - FAB_SIZE - EDGE_GAP),
      maxY: Math.max(EDGE_GAP, height - FAB_SIZE - EDGE_GAP),
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { maxX, maxY } = getBounds();
      setPosition({ x: maxX, y: maxY });
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const { maxX, maxY } = getBounds();
      setPosition((prev) => {
        if (!hasCustomPosition) {
          return { x: maxX, y: maxY };
        }
        return {
          x: clamp(prev.x, EDGE_GAP, maxX),
          y: clamp(prev.y, EDGE_GAP, maxY),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, [hasCustomPosition]);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) {
      setOpen(true);
      return;
    }

    event.preventDefault();
    setDragging(true);

    const pointerStart = { x: event.clientX, y: event.clientY };
    const buttonStart = { ...position };
    let moved = false;

    const onMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - pointerStart.x;
      const deltaY = moveEvent.clientY - pointerStart.y;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) moved = true;

      const { maxX, maxY } = getBounds();
      setPosition({
        x: clamp(buttonStart.x + deltaX, EDGE_GAP, maxX),
        y: clamp(buttonStart.y + deltaY, EDGE_GAP, maxY),
      });
    };

    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (moved) setHasCustomPosition(true);
      if (!moved) setOpen(true);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      <div
        className="sos-corner-shell"
        style={ready ? { left: `${position.x}px`, top: `${position.y}px` } : undefined}
      >
        <div className={`sos-tooltip${hovered && !dragging ? " sos-tooltip--visible" : ""}`}>
          {sent ? "Alert Sent Successfully!" : "Sends a direct emergency alert to Admin"}
        </div>
        <button
          className={`sos-fab ${sent ? "sos-fab--sent" : ""} ${dragging ? "sos-fab--dragging" : ""}`}
          onPointerDown={startDrag}
          onClick={() => {
            if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
              setOpen(true);
            }
          }}
          onMouseEnter={() => !sent && setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => !sent && setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label="Open emergency alert"
          disabled={sent}
        >
          <span className="sos-label-compact">{sent ? "SENT" : "SOS"}</span>
        </button>
      </div>

      {open && (
        <div className="sos-modal-overlay" onClick={() => setOpen(false)}>
          <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
            <button className="sos-close" onClick={() => setOpen(false)} aria-label="Close">
              <X size={16} />
            </button>
            <p className="sos-eyebrow">Emergency Support</p>
            <h3 className="sos-title">Need urgent help right now?</h3>
            <p className="sos-text">
              This will send an immediate, direct email to the BWF Founder/Admin.
              Use this when you or someone else is unsafe.
            </p>
            <button className="sos-confirm" onClick={triggerSOS} disabled={sending}>
              <AlertTriangle size={16} />
              {sending ? "Sending alert..." : "Confirm SOS Alert"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
