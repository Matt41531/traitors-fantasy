import supabase from "../../supabaseClient";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function Leaderboard() {
  const [usersData, setUsersData] = useState([]);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  let { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: userRows, error: userError } = await supabase
        .from("user_teams")
        .select("team_name, traitors, selected_winner_name, total_points, username");

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      } else {
        setUsersData(userRows);
      }

      const currentUser = userRows.find(
        (userData) => userData.username === user.username
      );
      if (currentUser) {
        setCurrentUserPoints(currentUser.total_points); // Set the current user's total points
      }
    };
    fetchUsers();
  }, [user.username]);
  return (
    <>
      <div className="flex justify-center items-center w-full md:w-3/4">
        {usersData ? (
          <Table>
            <TableCaption>
              Traitor&apos;s Season 3 Current Leaderboard
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">
                  Team Name
                </TableHead>
                <TableHead className="text-center">Traitors</TableHead>
                <TableHead className="text-center">Selected Winner</TableHead>
                <TableHead className="text-center text-yellow-500">
                  Total Points
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData.map((userData) => (
                <TableRow key={userData.team_name}>
                  <TableCell className="text-center font-medium">
                    {userData.team_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {userData.traitors}
                  </TableCell>
                  <TableCell className="text-center">
                    {userData.selected_winner_name}
                  </TableCell>
                  <TableCell className="text-center  text-yellow-500">
                    {userData.total_points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </div>
      <div>
        <h2 className="font-bold text-lg p-11">
          {" "}
          Total Team Points:{" "}
          <span className="font-bold text-yellow-600">{currentUserPoints}</span>
        </h2>
      </div>
    </>
  );
}

export default Leaderboard;
