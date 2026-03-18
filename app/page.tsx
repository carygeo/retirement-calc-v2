"use client";

import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

/* --------------------------- UI Components --------------------------- */
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

const Card = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6",
      className
    )}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("leading-none font-semibold", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("px-6", className)} {...props} />
);

const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => (
  <input
    type={type}
    className={cn(
      "placeholder:text-gray-500 border-gray-300 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      "focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px]",
      className
    )}
    {...props}
  />
);

const Label = ({ className, ...props }: React.ComponentProps<"label">) => (
  <label
    className={cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none",
      className
    )}
    {...props}
  />
);

const Slider = ({
  className,
  value = [50],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: {
  className?: string;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onValueChange?.([newValue]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider",
        className
      )}
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
          ((value[0] - min) / (max - min)) * 100
        }%, #e5e7eb ${((value[0] - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
      }}
      {...props}
    />
  );
};

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Tabs = ({ defaultValue, children, className = "" }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              activeTab,
              setActiveTab,
            } as TabsContextProps)
          : child
      )}
    </div>
  );
};

const TabsList = ({
  children,
  className = "",
  activeTab,
  setActiveTab,
}: {
  children: React.ReactNode;
  className?: string;
} & TabsContextProps) => (
  <div
    className={cn(
      "bg-gray-100 text-gray-600 inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
      className
    )}
  >
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, {
            activeTab,
            setActiveTab,
          } as TabsContextProps)
        : child
    )}
  </div>
);

const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
}: {
  value: string;
  children: React.ReactNode;
} & TabsContextProps) => (
  <button
    className={cn(
      "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50",
      activeTab === value
        ? "bg-white text-gray-900 shadow-sm"
        : "text-gray-700 hover:text-gray-900"
    )}
    onClick={() => setActiveTab?.(value)}
  >
    {children}
  </button>
);

const TabsContent = ({
  value,
  children,
  activeTab,
}: {
  value: string;
  children: React.ReactNode;
} & TabsContextProps) =>
  activeTab === value ? (
    <div className="flex-1 outline-none">{children}</div>
  ) : null;

/* --------------------------- Error Boundary --------------------------- */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<object>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 m-4 rounded-lg border border-rose-300 bg-rose-50 text-rose-800">
          <div className="font-semibold mb-1">
            Something went wrong rendering the preview.
          </div>
          <div className="text-sm opacity-80">{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* -------------------------------- Helpers ----------------------------- */
const currency = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const C = {
  salary: "#2563eb",
  pension: "#059669",
  ss: "#14b8a6",
  rentals: "#7c3aed",
  mango: "#f59e0b",
  liquidations: "#9333ea",
  expenses: "#ef4444",
  savingsFlow: "#fca5a5",
  savings: "#0ea5e9",
  healthcare: "#f87171",
  mortgage: "#8B008B", // bold pink
} as const;

/* --------------------------------- Types ------------------------------ */
interface Assumptions {
  currentYear: number;
  youAge: number;
  spouseAge: number;
  goalAge: number;
  retireAgeYou: number;
  retireAgeSpouse: number;
  // Income
  youSalary: number;
  spouseSalary: number;
  salaryGrowth: number;
  pensionAnnual: number;
  pensionCOLA: number;
  ssYouAnnual: number;
  ssStartAgeYou: number;
  ssCOLA: number;
  rentalGrowth: number;
  mangoAnnual: number;
  mangoStartAge: number;
  mangoGrowth: number;
  // Expenses
  baseLivingAnnual: number;
  housingAnnual: number;
  healthcareAnnual: number;
  healthcareGrowth: number; // extra growth over inflation (slider)
  healthcareVestingReduction: number;
  inflation: number;
  effectiveTaxRate: number;
  // Healthcare Plan Options
  healthcarePlan: "custom" | "anthem"; // radio button selection
  // Savings (cash-flow only; no investment growth)
  startingSavings: number;
  annualSavingsPreRetire: number;
}

interface PropertyCfg {
  on: boolean;
  net: number;
  saleYear: number | null;
  startYear: number | null; // gating start for income/mortgage/overhead
  loanEndYear: number | null; // mortgage stops before this year
  equityAtSale: number;
  mortgage: number;
  name?: string;
  overhead?: number; // applies only if this property is Primary
}
interface PropertiesState {
  [key: string]: PropertyCfg;
}

interface YearRow {
  year: number;
  ageYou: number;
  ageSpouse: number;
  incomeSalary: number;
  incomePension: number;
  incomeSS: number;
  incomeRental: number;
  incomeMango: number;
  incomeLiquidations: number;
  incomeSavings: number;
  totalIncome: number;
  expensesLiving: number;
  expensesHousing: number;
  expensesHealthcare: number;
  expensesMortgage: number;
  totalExpenses: number;
  taxes: number;
  primaryOverhead?: number;
  surplus: number;
  savingsStart: number;
  savingsEnd: number;
  savingsChange: number;
  savingsChangeCash: number; // (income − expenses − taxes) applied before adds
  contributionsAdded?: number;
  liquidationsAdded?: number;
}

/* ---------------------------- Series meta ----------------------------- */
type SeriesKey =
  | "Salary"
  | "Pension"
  | "SocialSecurity"
  | "Rentals"
  | "Mango"
  | "Liquidations"
  | "SavingsDraw"
  | "Healthcare"
  | "Mortgage"
  | "Expenses";

const SERIES: { key: SeriesKey; label: string; color: string }[] = [
  { key: "Salary", label: "Salary", color: C.salary },
  { key: "Pension", label: "Pension", color: C.pension },
  { key: "SocialSecurity", label: "SocialSecurity", color: C.ss },
  { key: "Rentals", label: "Rentals", color: C.rentals },
  { key: "Mango", label: "Mango", color: C.mango },
  { key: "Liquidations", label: "Liquidations", color: C.liquidations },
  { key: "SavingsDraw", label: "SavingsDraw", color: C.savingsFlow },
  { key: "Healthcare", label: "Healthcare", color: C.healthcare },
  { key: "Mortgage", label: "Mortgage", color: C.mortgage },
  { key: "Expenses", label: "Expenses", color: C.expenses },
];

/* ---------------------------- Core Projection ------------------------- */
function projectPlan(
  a: Assumptions,
  properties: PropertiesState,
  primaryKey: string | null
) {
  const rows: YearRow[] = [];
  let savings = a.startingSavings;
  const endAge = Math.max(a.goalAge, a.youAge, a.spouseAge);
  const youWorking = (age: number) => age < a.retireAgeYou;
  const spouseWorking = (age: number) => age < a.retireAgeSpouse;
  const bothRetiredBy = Math.max(a.retireAgeYou, a.retireAgeSpouse);

  for (let i = 0; ; i++) {
    const year = a.currentYear + i;
    const ageYou = a.youAge + i;
    const ageSpouse = a.spouseAge + i;
    if (ageYou > endAge && ageSpouse > endAge) break;

    const savingsStart = savings;

    // Incomes
    const incomeSalary =
      (youWorking(ageYou) ? a.youSalary * Math.pow(1 + a.salaryGrowth, i) : 0) +
      (spouseWorking(ageSpouse)
        ? a.spouseSalary * Math.pow(1 + a.salaryGrowth, i)
        : 0);

    const pensionStarts = ageSpouse >= a.retireAgeSpouse;
    const pensionYears = Math.max(
      0,
      i - Math.max(0, a.retireAgeSpouse - a.spouseAge)
    );
    const incomePension = pensionStarts
      ? a.pensionAnnual * Math.pow(1 + a.pensionCOLA, pensionYears)
      : 0;

    const ssStarts = ageYou >= a.ssStartAgeYou;
    const ssYears = Math.max(0, i - Math.max(0, a.ssStartAgeYou - a.youAge));
    const incomeSS = ssStarts
      ? a.ssYouAnnual * Math.pow(1 + a.ssCOLA, ssYears)
      : 0;

    // Rentals start only at each property's Start Year, stop at sale year
    const incomeRental = Object.values(properties).reduce((sum, p) => {
      if (!p.on) return sum;
      const starts = p.startYear ?? a.currentYear;
      if (year < starts) return sum;
      const sold = p.saleYear !== null && year >= p.saleYear;
      if (sold) return sum;
      const yearsSinceStart = Math.max(0, year - starts);
      const evolvedAbs =
        Math.abs(p.net) * Math.pow(1 + a.rentalGrowth, yearsSinceStart);
      const signed = (p.net >= 0 ? 1 : -1) * evolvedAbs;
      return sum + signed;
    }, 0);

    const incomeLiquidations = Object.values(properties).reduce(
      (sum, p) => sum + (p.on && p.saleYear === year ? p.equityAtSale : 0),
      0
    );

    const mangoStarts = ageYou >= a.mangoStartAge;
    const mangoYears = Math.max(0, i - Math.max(0, a.mangoStartAge - a.youAge));
    const incomeMango = mangoStarts
      ? a.mangoAnnual * Math.pow(1 + a.mangoGrowth, mangoYears)
      : 0;

    const totalIncome =
      incomeSalary +
      incomePension +
      incomeSS +
      incomeRental +
      incomeMango +
      incomeLiquidations;

    // Expenses
    const living = a.baseLivingAnnual * Math.pow(1 + a.inflation, i);
    const housing = a.housingAnnual * Math.pow(1 + a.inflation, i);

    // Healthcare: different logic based on plan selection
    let healthcare = 0;

    if (a.healthcarePlan === "anthem") {
      // Anthem plan: costs start at 55, reduce at 65
      if (ageYou >= 55) {
        if (ageYou >= 65) {
          // Medicare Advantage phase: $5,600/year, grows with healthcare slider only
          healthcare = 5600 * Math.pow(1 + a.healthcareGrowth, i);
        } else {
          // Pre-Medicare phase (55-64): $25,000/year, grows with healthcare slider only
          healthcare = 25000 * Math.pow(1 + a.healthcareGrowth, i);
        }
        // Apply vesting reduction if spouse is retired
        healthcare =
          ageSpouse >= a.retireAgeSpouse
            ? healthcare * (1 - a.healthcareVestingReduction)
            : healthcare;
      }
      // No healthcare costs before age 55 with Anthem plan
    } else {
      // Custom plan: use healthcare growth only (no double inflation)
      const hcWithGrowth =
        a.healthcareAnnual * Math.pow(1 + a.healthcareGrowth, i);
      healthcare =
        ageSpouse >= a.retireAgeSpouse
          ? hcWithGrowth * (1 - a.healthcareVestingReduction)
          : hcWithGrowth;
    }

    // Mortgage & primary overhead: from Start Year until sale; mortgage stops at loan end year
    const mortgageTotal = Object.values(properties).reduce((sum, p) => {
      if (!p.on) return sum;
      const starts = p.startYear ?? a.currentYear;
      if (year < starts) return sum;
      const sold = p.saleYear !== null && year >= p.saleYear;
      if (sold) return sum;
      const loanActive = p.loanEndYear == null || year < p.loanEndYear; // pay until the year before loanEndYear
      if (!loanActive) return sum;
      return sum + p.mortgage * 12;
    }, 0);

    const pPrimary = primaryKey
      ? (properties[primaryKey] as PropertyCfg)
      : null;
    const primaryOverhead =
      pPrimary &&
      pPrimary.on &&
      !(pPrimary.saleYear !== null && year >= pPrimary.saleYear) &&
      !(
        pPrimary.startYear !== null &&
        year < (pPrimary.startYear ?? a.currentYear)
      )
        ? (pPrimary.overhead ?? 0) * 12
        : 0;

    const totalExpenses =
      living + housing + healthcare + mortgageTotal + primaryOverhead;

    // Taxes
    const taxes =
      a.effectiveTaxRate *
      (incomeSalary +
        incomePension +
        incomeSS +
        incomeRental +
        incomeMango +
        incomeLiquidations);

    // Core income excludes liquidations
    const coreIncome =
      incomeSalary + incomePension + incomeSS + incomeRental + incomeMango;
    const expensesAll = totalExpenses + taxes;

    // ---- Savings mechanics (NO investment growth) ----
    const bothRetired = ageYou >= bothRetiredBy && ageSpouse >= bothRetiredBy;
    const contributions = bothRetired ? 0 : a.annualSavingsPreRetire;

    // (1) Apply net cashflow to savings (draw capped by pool)
    const netCashflowRaw = coreIncome - expensesAll; // + surplus, - deficit
    let incomeSavings = 0; // positive draw shown in chart
    let cashflowApplied = netCashflowRaw;
    if (netCashflowRaw < 0) {
      const maxDraw = Math.min(-netCashflowRaw, savings);
      incomeSavings = maxDraw;
      cashflowApplied = -maxDraw; // reduce savings
    }
    savings = savings + cashflowApplied;

    // (2) Add contributions and after-tax liquidations
    const contributionsAdded = contributions;
    savings += contributionsAdded;
    const liquidationsAdded = incomeLiquidations * (1 - a.effectiveTaxRate);
    savings += liquidationsAdded;

    // Surplus (kept for scoring/compat)
    const surplus = netCashflowRaw + incomeSavings; // ≈0 when pool covers deficit

    rows.push({
      year,
      ageYou,
      ageSpouse,
      incomeSalary,
      incomePension,
      incomeSS,
      incomeRental,
      incomeMango,
      incomeLiquidations,
      incomeSavings,
      totalIncome,
      expensesLiving: living,
      expensesHousing: housing,
      expensesHealthcare: healthcare,
      expensesMortgage: mortgageTotal,
      totalExpenses,
      taxes,
      surplus,
      savingsStart,
      savingsEnd: savings,
      savingsChange: savings - savingsStart,
      savingsChangeCash: cashflowApplied,
      contributionsAdded,
      liquidationsAdded,
      primaryOverhead,
    });
  }

  const deficits = rows.filter((r) => r.surplus < 0).length;
  const estate = savings;
  const base = 97;
  const penalty = clamp(
    deficits * 1.2 + (estate < 100000 ? 10 : 0) + (estate < 50000 ? 10 : 0),
    0,
    40
  );
  const score = clamp(Math.round(base - penalty), 0, 100);
  const monthlyAvg = rows.reduce((a, r) => a + r.surplus / 12, 0) / rows.length;
  return { rows, score, monthlyAvg, estate };
}

/* ------------------------ Legend with checkboxes ---------------------- */
function LegendWithCheckboxes({
  visibleSeries,
  onToggle,
}: {
  visibleSeries: Record<SeriesKey, boolean>;
  onToggle: (key: SeriesKey) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 pb-2">
      {SERIES.map(({ key, label, color }) => (
        <label
          key={key}
          className="inline-flex items-center gap-2 text-sm cursor-pointer select-none"
        >
          <input
            type="checkbox"
            className="h-4 w-4 accent-indigo-600"
            checked={visibleSeries[key]}
            onChange={() => onToggle(key)}
          />
          <span className="inline-flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded"
              style={{ background: color }}
            />
            <span>{label}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

/* ------------------------------ Component ----------------------------- */
export default function RetirementPlanner() {
  const defaultYear = new Date().getFullYear();

  // ===== Blank presets to make "start from scratch" trivial =====
  const BLANK_PROPERTIES: PropertiesState = {
    property1: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
    property2: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
    property3: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
    property4: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
    property5: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
    property6: {
      on: false,
      net: 0,
      saleYear: null,
      startYear: null,
      loanEndYear: null,
      equityAtSale: 0,
      mortgage: 0,
      name: "",
      overhead: 0,
    },
  };

  const BLANK_ASSUMPTIONS: Assumptions = {
    currentYear: defaultYear,
    youAge: 40,
    spouseAge: 40,
    retireAgeYou: 65,
    retireAgeSpouse: 65,
    goalAge: 90,
    // Income
    youSalary: 0,
    spouseSalary: 0,
    salaryGrowth: 0,
    pensionAnnual: 0,
    pensionCOLA: 0,
    ssYouAnnual: 0,
    ssStartAgeYou: 67,
    ssCOLA: 0,
    rentalGrowth: 0,
    mangoAnnual: 0,
    mangoStartAge: 60,
    mangoGrowth: 0,
    // Expenses
    baseLivingAnnual: 0,
    housingAnnual: 0,
    healthcareAnnual: 0,
    healthcareGrowth: 0,
    healthcareVestingReduction: 0,
    inflation: 0,
    effectiveTaxRate: 0,
    // Plan
    healthcarePlan: "custom",
    // Savings
    startingSavings: 0,
    annualSavingsPreRetire: 0,
  };

  // ===== State (blank by default) =====
  const [properties, setProperties] =
    useState<PropertiesState>(BLANK_PROPERTIES);
  const [a, setA] = useState<Assumptions>(BLANK_ASSUMPTIONS);
  const [primaryKey, setPrimaryKey] = useState<string | null>(null);

  // Reset helpers
  const resetAll = () => {
    setProperties(BLANK_PROPERTIES);
    setA(BLANK_ASSUMPTIONS);
    setPrimaryKey(null);
  };

  // Checkbox visibility: default all visible
  const [visibleSeries, setVisibleSeries] = useState<
    Record<SeriesKey, boolean>
  >(
    Object.fromEntries(SERIES.map((s) => [s.key, true])) as Record<
      SeriesKey,
      boolean
    >
  );
  const toggleSeries = (k: SeriesKey) =>
    setVisibleSeries((prev) => ({ ...prev, [k]: !prev[k] }));
  const isVisible = (k: SeriesKey) => !!visibleSeries[k];

  const model = useMemo(
    () => projectPlan(a, properties, primaryKey),
    [a, properties, primaryKey]
  );

  /* ----------------------------- Tooltip ------------------------------ */
  // Tooltip shows TRUE values from the model (not affected by visibility)
  interface TooltipProps {
    active?: boolean;
    label?: string | number;
  }

  const IncomeTooltip = ({ active, label }: TooltipProps) => {
    if (!active) return null;
    const yr = Number(label);
    const row = model.rows.find((r) => r.year === yr);
    if (!row) return null;

    const coreIncome =
      row.incomeSalary +
      row.incomePension +
      row.incomeSS +
      row.incomeRental +
      row.incomeMango;
    const expensesTrue = row.totalExpenses + row.taxes;
    const monthlyExpensesTrue = expensesTrue / 12;

    return (
      <div className="rounded-md bg-white/95 backdrop-blur px-3 py-2 shadow border border-slate-200 text-sm min-w-[320px]">
        <div className="font-medium text-slate-800 mb-1">Year {label}</div>

        {/* Income breakdown */}
        {row.incomeSalary !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.salary }}
              />
              <span style={{ color: C.salary }}>Salary</span>
            </span>
            <span className="font-medium">{currency(row.incomeSalary)}</span>
          </div>
        )}
        {row.incomePension !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.pension }}
              />
              <span style={{ color: C.pension }}>Pension</span>
            </span>
            <span className="font-medium">{currency(row.incomePension)}</span>
          </div>
        )}
        {row.incomeSS !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.ss }}
              />
              <span style={{ color: C.ss }}>SocialSecurity</span>
            </span>
            <span className="font-medium">{currency(row.incomeSS)}</span>
          </div>
        )}
        {row.incomeRental !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.rentals }}
              />
              <span style={{ color: C.rentals }}>Rentals</span>
            </span>
            <span className="font-medium">{currency(row.incomeRental)}</span>
          </div>
        )}
        {row.incomeMango !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.mango }}
              />
              <span style={{ color: C.mango }}>Mango</span>
            </span>
            <span className="font-medium">{currency(row.incomeMango)}</span>
          </div>
        )}
        {row.incomeLiquidations !== 0 && (
          <div className="flex justify-between gap-6">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.liquidations }}
              />
              <span style={{ color: C.liquidations }}>Liquidations</span>
            </span>
            <span className="font-medium">
              {currency(row.incomeLiquidations)}
            </span>
          </div>
        )}

        <div className="mt-2 border-t pt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600">Core Income (ex SavingsDraw)</span>
            <span className="font-semibold">{currency(coreIncome)}</span>
          </div>

          <div className="flex justify-between">
            <span
              className="text-slate-600"
              style={{ color: C.expenses, fontWeight: 600 }}
            >
              Expenses + Taxes (true)
            </span>
            <span className="font-semibold" style={{ color: C.expenses }}>
              {currency(expensesTrue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Expenses + Taxes (monthly)</span>
            <span>{currency(monthlyExpensesTrue)}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.healthcare }}
              />
              <span style={{ color: C.healthcare, fontWeight: 600 }}>
                Healthcare (included in expenses)
              </span>
            </span>
            <span className="font-semibold" style={{ color: C.healthcare }}>
              {currency(row.expensesHealthcare)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.mortgage }}
              />
              <span style={{ color: C.mortgage, fontWeight: 700 }}>
                Mortgage (included in expenses)
              </span>
            </span>
            <span className="font-semibold" style={{ color: C.mortgage }}>
              {currency(row.expensesMortgage)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.savingsFlow }}
              />
              <span style={{ color: C.savingsFlow, fontWeight: 600 }}>
                SavingsDraw (used)
              </span>
            </span>
            <span className="font-semibold" style={{ color: C.savingsFlow }}>
              {currency(row.incomeSavings)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded"
                style={{ background: C.savings }}
              />
              <span style={{ color: C.savings, fontWeight: 600 }}>
                Savings (end of year)
              </span>
            </span>
            <span className="font-semibold" style={{ color: C.savings }}>
              {currency(row.savingsEnd)}
            </span>
          </div>

          <div className="flex justify-between text-slate-600">
            <span>Net Savings Change</span>
            <span className="font-semibold">
              {currency(row.savingsChangeCash)}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            (Cash flow only — no market growth; includes contributions and
            after-tax liquidations)
          </div>
        </div>
      </div>
    );
  };

  /* ----------------------------- Chart data ---------------------------- */
  const safeRows = Array.isArray(model?.rows) ? model.rows : [];
  const chartData = useMemo(
    () =>
      safeRows.map((r) => ({
        year: r.year,
        Salary: Math.round(r.incomeSalary),
        Pension: Math.round(r.incomePension),
        SocialSecurity: Math.round(r.incomeSS),
        Rentals: Math.round(r.incomeRental),
        Mango: Math.round(r.incomeMango),
        Liquidations: Math.round(r.incomeLiquidations),
        SavingsDraw: Math.round(r.incomeSavings),
        Healthcare: Math.round(r.expensesHealthcare),
        Mortgage: Math.round(r.expensesMortgage),
        // PrimaryOverhead intentionally NOT included in the chart
        Expenses: Math.round(r.expensesLiving + r.expensesHousing + r.taxes),
      })),
    [safeRows]
  );

  const savingsData = useMemo(
    () =>
      safeRows.map((r) => ({
        year: r.year,
        Savings: Math.round(r.savingsEnd),
      })),
    [safeRows]
  );

  /* -------------------------------- Inputs ---------------------------- */
  interface NumProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
  }

  interface PctProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
  }

  const Num = ({
    label,
    value,
    onChange,
    step = 1000,
    min = -2_000_000,
    max = 2_000_000,
  }: NumProps) => (
    <div className="space-y-1">
      <Label className="text-sm text-gray-600">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        value={String(value ?? "")}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        min={min}
        max={max}
        className="bg-white/60"
      />
    </div>
  );
  const Pct = ({
    label,
    value,
    onChange,
    min = 0,
    max = 20,
    step = 0.25,
  }: PctProps) => (
    <div className="space-y-1">
      <Label className="text-sm text-gray-600">
        {label} ({Math.round(value * 1000) / 10}%)
      </Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value * 100]}
        onValueChange={(v) => onChange(v[0] / 100)}
        className="pt-3"
      />
    </div>
  );

  const planScoreColor =
    model.score >= 85
      ? "text-emerald-600"
      : model.score >= 70
      ? "text-amber-600"
      : "text-rose-600";

  /* -------------------------------- Render ---------------------------- */
  return (
    <ErrorBoundary>
      <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Retirement Planner
              </h1>
              <p className="text-slate-600 text-sm">
                Start from a clean slate: enter only the numbers that apply to
                you.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetAll}
                className="rounded-lg bg-white border px-3 py-2 text-sm shadow-sm hover:bg-slate-50"
              >
                Reset to Blank
              </button>
              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm">
                <div className="text-xs text-slate-500">Score</div>
                <div className={`text-xl font-semibold ${planScoreColor}`}>
                  {model.score}
                </div>
                <div className="text-xs text-slate-500">
                  Estate @{a.goalAge}:{" "}
                  <span className="font-medium text-slate-700">
                    {currency(model.estate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lifetime Projection */}
          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Lifetime Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-[580px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    width={70}
                  />
                  <Tooltip content={<IncomeTooltip />} />

                  {/* Custom Legend with embedded checkboxes */}
                  <Legend
                    verticalAlign="top"
                    align="left"
                    height={52}
                    wrapperStyle={{ paddingBottom: 8 }}
                    content={() => (
                      <LegendWithCheckboxes
                        visibleSeries={visibleSeries}
                        onToggle={toggleSeries}
                      />
                    )}
                  />

                  {/* Render all non-Expenses series first... */}
                  {isVisible("Salary") && (
                    <Bar dataKey="Salary" stackId="income" fill={C.salary} />
                  )}
                  {isVisible("Pension") && (
                    <Bar dataKey="Pension" stackId="income" fill={C.pension} />
                  )}
                  {isVisible("SocialSecurity") && (
                    <Bar
                      dataKey="SocialSecurity"
                      stackId="income"
                      fill={C.ss}
                    />
                  )}
                  {isVisible("Rentals") && (
                    <Bar dataKey="Rentals" stackId="income" fill={C.rentals} />
                  )}
                  {isVisible("Mango") && (
                    <Bar dataKey="Mango" stackId="income" fill={C.mango} />
                  )}
                  {isVisible("Liquidations") && (
                    <Bar
                      dataKey="Liquidations"
                      stackId="income"
                      fill={C.liquidations}
                    />
                  )}
                  {isVisible("SavingsDraw") && (
                    <Bar
                      dataKey="SavingsDraw"
                      stackId="income"
                      fill={C.savingsFlow}
                    />
                  )}
                  {isVisible("Healthcare") && (
                    <Bar
                      dataKey="Healthcare"
                      stackId="income"
                      fill={C.healthcare}
                    />
                  )}
                  {isVisible("Mortgage") && (
                    <Bar
                      dataKey="Mortgage"
                      stackId="income"
                      fill={C.mortgage}
                    />
                  )}

                  {/* ...and ALWAYS render Expenses last so it paints on top */}
                  {isVisible("Expenses") && (
                    <Bar
                      dataKey="Expenses"
                      stackId="income"
                      fill={C.expenses}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Num
                      label="Your Salary"
                      value={a.youSalary}
                      onChange={(v: number) => setA({ ...a, youSalary: v })}
                    />
                    <Num
                      label="Spouse Salary"
                      value={a.spouseSalary}
                      onChange={(v: number) => setA({ ...a, spouseSalary: v })}
                    />
                    <Pct
                      label="Salary Growth"
                      value={a.salaryGrowth}
                      onChange={(v: number) => setA({ ...a, salaryGrowth: v })}
                      max={10}
                    />

                    <Num
                      label="Pension (annual)"
                      value={a.pensionAnnual}
                      onChange={(v: number) => setA({ ...a, pensionAnnual: v })}
                    />
                    <Pct
                      label="Pension COLA"
                      value={a.pensionCOLA}
                      onChange={(v: number) => setA({ ...a, pensionCOLA: v })}
                      max={8}
                    />

                    <Num
                      label="Social Security (you, annual)"
                      value={a.ssYouAnnual}
                      onChange={(v: number) => setA({ ...a, ssYouAnnual: v })}
                    />
                    <Num
                      label="SS Start Age (you)"
                      value={a.ssStartAgeYou}
                      onChange={(v: number) => setA({ ...a, ssStartAgeYou: v })}
                      step={1}
                      min={50}
                      max={75}
                    />
                    <Pct
                      label="SS COLA"
                      value={a.ssCOLA}
                      onChange={(v: number) => setA({ ...a, ssCOLA: v })}
                      max={6}
                    />

                    <Num
                      label="Other Income (annual)"
                      value={a.mangoAnnual}
                      onChange={(v: number) => setA({ ...a, mangoAnnual: v })}
                    />
                    <Num
                      label="Other Income Start Age (you)"
                      value={a.mangoStartAge}
                      onChange={(v: number) => setA({ ...a, mangoStartAge: v })}
                      step={1}
                      min={30}
                      max={80}
                    />
                    <Pct
                      label="Other Income Growth (annual %)"
                      value={a.mangoGrowth}
                      onChange={(v: number) => setA({ ...a, mangoGrowth: v })}
                      max={15}
                      step={0.25}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="expenses" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Num
                      label="Living Expenses (annual)"
                      value={a.baseLivingAnnual}
                      onChange={(v: number) =>
                        setA({ ...a, baseLivingAnnual: v })
                      }
                    />
                    <Num
                      label="Housing (tax+ins, annual)"
                      value={a.housingAnnual}
                      onChange={(v: number) => setA({ ...a, housingAnnual: v })}
                    />

                    {/* Healthcare Plan Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm text-gray-600">
                        Healthcare Plan
                      </Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="healthcare-plan"
                            className="h-4 w-4 accent-blue-600"
                            checked={a.healthcarePlan === "anthem"}
                            onChange={() =>
                              setA({ ...a, healthcarePlan: "anthem" })
                            }
                          />
                          <span className="font-medium">
                            Anthem Medicare Plan
                          </span>
                        </label>
                        <div className="text-xs text-gray-500 ml-6">
                          Age 55-64: $25k/year • Age 65+: $5.6k/year
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="healthcare-plan"
                            className="h-4 w-4 accent-blue-600"
                            checked={a.healthcarePlan === "custom"}
                            onChange={() =>
                              setA({ ...a, healthcarePlan: "custom" })
                            }
                          />
                          <span className="font-medium">Custom Plan</span>
                        </label>
                      </div>
                    </div>

                    {/* Custom Healthcare Controls - only show if custom plan selected */}
                    {a.healthcarePlan === "custom" && (
                      <Num
                        label="Healthcare (annual)"
                        value={a.healthcareAnnual}
                        onChange={(v: number) =>
                          setA({ ...a, healthcareAnnual: v })
                        }
                      />
                    )}

                    {/* Healthcare Growth - show for both plans */}
                    <Pct
                      label="Healthcare Annual Increase (%)"
                      value={a.healthcareGrowth}
                      onChange={(v: number) =>
                        setA({ ...a, healthcareGrowth: v })
                      }
                      max={15}
                    />

                    <Pct
                      label="Healthcare Vesting Reduction"
                      value={a.healthcareVestingReduction}
                      onChange={(v: number) =>
                        setA({ ...a, healthcareVestingReduction: v })
                      }
                      max={80}
                    />
                    <Pct
                      label="Inflation"
                      value={a.inflation}
                      onChange={(v: number) => setA({ ...a, inflation: v })}
                      max={10}
                    />
                    <Pct
                      label="Effective Tax Rate"
                      value={a.effectiveTaxRate}
                      onChange={(v: number) =>
                        setA({ ...a, effectiveTaxRate: v })
                      }
                      max={45}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="properties" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      [
                        { key: "property1", label: "Property 1" },
                        { key: "property2", label: "Property 2" },
                        { key: "property3", label: "Property 3" },
                        { key: "property4", label: "Property 4" },
                        { key: "property5", label: "Property 5" },
                        { key: "property6", label: "Property 6" },
                      ] as const
                    ).map((p) => (
                      <Card key={p.key} className="shadow-sm">
                        <CardContent className="grid grid-cols-12 items-center gap-3 py-3">
                          <div className="col-span-5 flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-indigo-600"
                              checked={properties[p.key].on}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    on: e.target.checked,
                                  },
                                })
                              }
                            />
                            <span className="font-medium">{p.label}</span>
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[11px] text-slate-500">
                              Net / yr
                            </Label>
                            <Input
                              type="number"
                              value={properties[p.key].net}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    net: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[11px] text-slate-500">
                              Sold Year
                            </Label>
                            <Input
                              type="number"
                              placeholder="e.g. 2030"
                              value={properties[p.key].saleYear ?? ""}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    saleYear: e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[11px] text-slate-500">
                              Start Year
                            </Label>
                            <Input
                              type="number"
                              placeholder="e.g. 2026"
                              value={properties[p.key].startYear ?? ""}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    startYear: e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[11px] text-slate-500">
                              Loan End Year
                            </Label>
                            <Input
                              type="number"
                              placeholder="e.g. 2036"
                              value={properties[p.key].loanEndYear ?? ""}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    loanEndYear: e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-[11px] text-slate-500">
                              Equity at Sale
                            </Label>
                            <Input
                              type="number"
                              value={properties[p.key].equityAtSale}
                              onChange={(e) =>
                                setProperties({
                                  ...properties,
                                  [p.key]: {
                                    ...properties[p.key],
                                    equityAtSale: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>

                          <div className="col-span-12 grid grid-cols-12 gap-3">
                            <div className="col-span-6">
                              <Label className="text-[11px] text-slate-500">
                                Mortgage / mo
                              </Label>
                              <Input
                                type="number"
                                value={properties[p.key].mortgage}
                                onChange={(e) =>
                                  setProperties({
                                    ...properties,
                                    [p.key]: {
                                      ...properties[p.key],
                                      mortgage: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-6">
                              <Label className="text-[11px] text-slate-500">
                                Overhead / mo (primary only)
                              </Label>
                              <Input
                                type="number"
                                value={properties[p.key].overhead}
                                onChange={(e) =>
                                  setProperties({
                                    ...properties,
                                    [p.key]: {
                                      ...properties[p.key],
                                      overhead: Number(e.target.value),
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-12 flex items-center gap-3">
                              <input
                                type="radio"
                                name="primary-home"
                                className="h-4 w-4 accent-emerald-600"
                                checked={primaryKey === p.key}
                                onChange={() => setPrimaryKey(p.key)}
                              />
                              <Label className="text-[11px] text-slate-600">
                                Set as Primary for retirement (includes mortgage
                                & overhead in expenses)
                              </Label>
                            </div>
                            <div className="col-span-12">
                              <Label className="text-[11px] text-slate-500">
                                Custom name
                              </Label>
                              <Input
                                type="text"
                                value={properties[p.key].name}
                                onChange={(e) =>
                                  setProperties({
                                    ...properties,
                                    [p.key]: {
                                      ...properties[p.key],
                                      name: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., Cape Coral"
                              />
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 col-span-12">
                              A property&apos;s income & mortgage begin at its{" "}
                              <span className="font-semibold">Start Year</span>.
                              Mortgage stops at{" "}
                              <span className="font-semibold">
                                Loan End Year
                              </span>{" "}
                              (or earlier if sold). Mortgages count toward
                              yearly expenses (×12) and appear as{" "}
                              <span
                                style={{ color: C.mortgage, fontWeight: 700 }}
                              >
                                bold pink
                              </span>
                              .
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 pt-2">
                    Primary selected:{" "}
                    <span className="font-medium">{primaryKey ?? "None"}</span>.
                    Rental net (pre-sale) compounds from each property&apos;s
                    Start Year. Liquidations appear as purple in the chosen sale
                    year.
                  </div>
                </TabsContent>

                <TabsContent value="assumptions" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-cols-3">
                    <Num
                      label="Starting Savings"
                      value={a.startingSavings}
                      onChange={(v: number) =>
                        setA({ ...a, startingSavings: v })
                      }
                    />
                    <Num
                      label="Annual Savings (pre-ret)"
                      value={a.annualSavingsPreRetire}
                      onChange={(v: number) =>
                        setA({ ...a, annualSavingsPreRetire: v })
                      }
                    />

                    <Num
                      label="Your Age"
                      value={a.youAge}
                      onChange={(v: number) => setA({ ...a, youAge: v })}
                      step={1}
                      min={35}
                      max={80}
                    />
                    <Num
                      label="Spouse Age"
                      value={a.spouseAge}
                      onChange={(v: number) => setA({ ...a, spouseAge: v })}
                      step={1}
                      min={35}
                      max={85}
                    />
                    <Num
                      label="Your Retire Age"
                      value={a.retireAgeYou}
                      onChange={(v: number) => setA({ ...a, retireAgeYou: v })}
                      step={1}
                      min={45}
                      max={75}
                    />
                    <Num
                      label="Spouse Retire Age"
                      value={a.retireAgeSpouse}
                      onChange={(v: number) =>
                        setA({ ...a, retireAgeSpouse: v })
                      }
                      step={1}
                      min={45}
                      max={75}
                    />
                    <Num
                      label="Goal Age"
                      value={a.goalAge}
                      onChange={(v: number) => setA({ ...a, goalAge: v })}
                      step={1}
                      min={75}
                      max={100}
                    />

                    <Pct
                      label="Rental Net Growth (avg ~2%)"
                      value={a.rentalGrowth}
                      onChange={(v: number) => setA({ ...a, rentalGrowth: v })}
                      max={10}
                      step={0.25}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Savings / Estate */}
          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Savings / Estate</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={savingsData}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={C.savings}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={C.savings}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    width={70}
                  />
                  <Tooltip formatter={(v: number) => currency(v)} />
                  <Area
                    type="monotone"
                    dataKey="Savings"
                    stroke={C.savings}
                    strokeWidth={2}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500">
            This planner uses cash flow only (no market growth). Liquidations
            taxed at the effective rate; adjust equity-at-sale for post-cost
            proceeds.
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
