import SummaryBanner from '../components/SummaryBanner';
import SeverityBarChart from '../components/SeverityBarChart';
import ActionStatusPieChart from '../components/ActionStatusPieChart';

export default function ExecutiveDashboard() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Executive Dashboard</h1>
      <SummaryBanner />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SeverityBarChart onSelectSeverity={() => {}} />
        <ActionStatusPieChart onSelectStatus={() => {}} />
      </div>
    </div>
  );
}
