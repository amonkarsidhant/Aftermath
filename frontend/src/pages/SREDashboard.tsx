import SummaryBanner from '../components/SummaryBanner';
import MetricsTab from '../components/MetricsTab';
import TimelineTab from '../components/TimelineTab';

export default function SREDashboard() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">SRE Dashboard</h1>
      <SummaryBanner />
      <MetricsTab />
      <TimelineTab />
    </div>
  );
}
