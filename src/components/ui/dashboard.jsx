import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import supabase from "../../supabaseClient";
import Leaderboard from "./leaderboard";
import { useNavigate } from "react-router";
import { Button } from "./button";

function Dashboard() {
  const { user } = useUser();
  const [selectedTraitors, setSelectedTraitors] = useState([]);
  const [leagueCode, setLeagueCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      // Fetch league code
      const { data: leagueData, error: leagueError } = await supabase
        .from("user_leagues")
        .select("league_code")
        .eq("username", user.username)
        .single();

      if (leagueError) {
        console.error("Error fetching league:", leagueError);
        navigate("/league");
      } else {
        setLeagueCode(leagueData.league_code);
      }

      // Fetch traitors data
      const { data: dashboardData, error: dashboardError } = await supabase
        .from("user_dashboard")
        .select(
          "traitor_1_path, traitor_2_path, traitor_3_path, traitor_4_path, traitor_1_current_points, traitor_2_current_points, traitor_3_current_points, traitor_4_current_points"
        )
        .eq("username", user.username)
        .single();

      if (dashboardError) {
        console.error("Error fetching user:", dashboardError);
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
        ].filter((traitor) => traitor.path);
        setSelectedTraitors(formattedTraitors);
      }
    };
    
    if (user?.username) {
      fetchData();
    }
  }, [user?.username]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(leagueCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {leagueCode && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">League Code:</p>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-800 transition-colors"
          >
            <span className="font-mono">{leagueCode}</span>
            {copySuccess ? (
              <span className="ml-2 text-green-400">✓ Copied!</span>
            ) : (
              <span className="ml-2 text-gray-400">📋</span>
            )}
          </button>
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full">
        {selectedTraitors.length === 0 ? (
          <div>
            <div className="text-center text-2xl font-bold">No Traitors Selected</div>
            <Button onClick={() => navigate('/draft')}>Go to Draft</Button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
