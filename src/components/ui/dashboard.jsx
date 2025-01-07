import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import supabase from "../../supabaseClient";
import Leaderboard from "./leaderboard";
import { useNavigate } from "react-router";

function Dashboard() {
  const { user } = useUser();
  const [selectedTraitors, setSelectedTraitors] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTraitors = async () => {
      const { data: dashboardData, error: dashboardError } = await supabase
        .from("user_dashboard")
        .select(
          "traitor_1_path, traitor_2_path, traitor_3_path, traitor_4_path, traitor_1_current_points, traitor_2_current_points, traitor_3_current_points, traitor_4_current_points"
        )
        .eq("username", user.username)
        .single();

      if (dashboardError) {
        console.error("Error fetching user:", dashboardError);
        navigate('/draft');
        return;
      } else {
        const formattedTraitors = [
          {
            path: dashboardData.traitor_1_path,
            current_points: dashboardData.traitor_1_current_points,
          },
          {
            path: dashboardData.traitor_2_path,
            current_points: dashboardData.traitor_2_current_points,
          },
          {
            path: dashboardData.traitor_3_path,
            current_points: dashboardData.traitor_3_current_points,
          },
          {
            path: dashboardData.traitor_4_path,
            current_points: dashboardData.traitor_4_current_points,
          },
        ].filter((traitor) => traitor.path); // Filter out empty/null paths
        setSelectedTraitors(formattedTraitors);
      }
    };
    fetchTraitors();
  }, [user.username, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col justify-center items-center w-full">
        <Leaderboard></Leaderboard>
        <div className="flex flex-col justify-center items-center w-full md:flex-row">
          {selectedTraitors.map((traitor) => (
            <div className="m-5" key={traitor.path}>
              <img src={traitor.path} />
              <p className="font-light">
                {" "}
                Current Points:{" "}
                <span className="font-bold text-yellow-600">
                  {traitor.current_points}
                </span>{" "}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
