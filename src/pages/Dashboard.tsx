import UserDashboard from "@/components/UserDashboard";
import Navigation from "@/components/Navigation";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-garden">
      <Navigation />
      <div className="pt-24 pb-12 px-4">
        <UserDashboard />
      </div>
    </div>
  );
};

export default Dashboard;