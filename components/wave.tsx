// Curva tirada da perna do "Q": é o divisor de seções ("fluidez" do manual).
export function Wave({ top, bottom, flip = false }: { top: string; bottom: string; flip?: boolean }) {
  return (
    <div aria-hidden className={bottom}>
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={`block h-12 w-full md:h-20 ${top} ${flip ? "-scale-x-100" : ""}`}
      >
        <path d="M0 0H1440V22C1180 22 1060 88 820 88C560 88 430 40 0 52Z" fill="currentColor" />
      </svg>
    </div>
  );
}
