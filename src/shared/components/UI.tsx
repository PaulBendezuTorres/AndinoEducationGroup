import type { ReactNode } from "react";

const A = "/assets";

export const icons = {
  home: "0bd12.svg",
  students: "6f7e8.svg",
  files: "f9d2e.svg",
  settings: "de35a.svg",
  plug: "12e34.svg",
  shield: "ff04f.svg",
  help: "5a145.svg",
  bell: "ed9f0.svg",
  chevron: "4f9df.svg",
  swap: "9299f.svg",
  search: "097c0.svg",
  down: "13670.svg",
  info: "34771.svg",
  back: "28c74.svg",
  refresh: "62945.svg",
  warning: "dec09.svg",
  lock: "da8f1.svg",
  pencil: "83584.svg",
  scan: "221a6.svg",
  folder: "c6883.svg",
  message: "3ecf3.svg",
  folderCheck: "25d8a.svg",
  userCheck: "8a441.svg",
  userPlus: "a95de.svg",
  sparkles: "baffe.svg",
};

export function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <img className="icon" src={`${A}/${icons[name]}`} width={size} height={size} alt="" />;
}

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <div className={`brand ${large ? "brand-large" : ""}`}>
      <div className="brand-mark">
        <img src={`${A}/ccc1e.png`} alt="" />
      </div>
      <div>
        <strong>Andino</strong>
        <span>Education Group</span>
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "gray";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Button({
  children,
  primary = false,
  danger = false,
  disabled = false,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={`button ${primary ? "primary" : ""} ${danger ? "danger" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function PageHead({
  title,
  subtitle,
  action,
  back,
  onBack,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  back?: string;
  onBack?: () => void;
}) {
  return (
    <div className="page-head">
      <div>
        {back && (
          <button type="button" className="back-link" onClick={onBack}>
            <Icon name="back" size={14} /> {back}
          </button>
        )}
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action && <div className="head-action">{action}</div>}
    </div>
  );
}

export function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="info-banner">
      <Icon name="info" size={16} />
      <span>{children}</span>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  );
}
