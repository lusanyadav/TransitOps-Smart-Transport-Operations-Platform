/**
 * <PageHeader title="Vehicle Registry" subtitle="Master list of fleet assets." action={<Button>+ Add Vehicle</Button>} />
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-text-900">{title}</h1>
        {subtitle && <p className="text-sm text-text-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
